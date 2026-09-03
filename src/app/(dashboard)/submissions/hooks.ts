import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubmissions } from "@/lib/mock-data";
import { submissionsApi, parentStudentsApi } from "@/lib/api-client";
import { Submission } from "@/types";

export function useSubmissionsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  const [searchSubId, setSearchSubId] = React.useState("");
  const [activeSubmissionDetail, setActiveSubmissionDetail] =
    React.useState<Submission | null>(null);

  const [isLoadingLive, setIsLoadingLive] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Manual grading state for teachers
  const [gradeAnswerId, setGradeAnswerId] = React.useState("");
  const [gradePoints, setGradePoints] = React.useState<number>(10);

  // Live fetch for parents (fetch child wards) and lookup
  React.useEffect(() => {
    if (isDemoMode) return;
    if (currentRole === "PARENT") {
      parentStudentsApi.getChildren().catch(() => {});
    }
  }, [isDemoMode, currentRole]);

  const handleLookupSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchSubId.trim()) return;
    try {
      setIsLoadingLive(true);
      const res = await submissionsApi.findOne(searchSubId.trim());
      setActiveSubmissionDetail(res.data);
    } catch {
      setFeedbackMsg("Failed to find submission with specified ID");
    } finally {
      setIsLoadingLive(false);
    }
  };

  const startGradingAnswer = (answerId: string, currentPoints?: number) => {
    setGradeAnswerId(answerId);
    setGradePoints(currentPoints || 10);
  };

  const cancelGradingAnswer = () => setGradeAnswerId("");

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionDetail || !gradeAnswerId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Grade updated in demo mode");
        return;
      }
      await submissionsApi.grade(activeSubmissionDetail.id, {
        grades: [
          { answerId: gradeAnswerId, pointsEarned: Number(gradePoints) || 0 },
        ],
      });
      setFeedbackMsg("Submission grade updated successfully!");
      // Reload submission detail
      const updated = await submissionsApi.findOne(activeSubmissionDetail.id);
      setActiveSubmissionDetail(updated.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to grade submission";
      setFeedbackMsg(message);
    }
  };

  const displaySubmissions = getMockSubmissions(currentRole);

  const pageTitle =
    currentRole === "TEACHER"
      ? "Student Submissions & Grading Hub"
      : currentRole === "PARENT"
        ? "Child's Submission History"
        : "My Submission History";

  const pageDescription =
    currentRole === "TEACHER"
      ? "Review student answer submissions, grade short answers, and check score metrics"
      : currentRole === "PARENT"
        ? "Track your child's quiz attempts, scores, and grading status"
        : "Your past quiz attempts, submitted assignments, and graded results";

  return {
    currentRole,
    isDemoMode,
    pageTitle,
    pageDescription,
    searchSubId,
    setSearchSubId,
    isLoadingLive,
    handleLookupSubmission,
    feedbackMsg,
    setFeedbackMsg,
    activeSubmissionDetail,
    gradeAnswerId,
    gradePoints,
    setGradePoints,
    startGradingAnswer,
    cancelGradingAnswer,
    handleGradeSubmission,
    displaySubmissions,
  };
}
