import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubmissions, SubmissionRow } from "@/lib/mock-data";
import { submissionsApi, parentStudentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { Submission } from "@/types";

function formatSubmittedAt(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function toSubmissionRow(s: Submission): SubmissionRow {
  return {
    id: s.id,
    studentName: s.student?.name ?? s.studentId,
    assessmentTitle: s.assessment?.title ?? "Untitled Assessment",
    subject: s.assessment?.teachingAssignment?.subject?.name ?? "—",
    score: s.scorePercentage ?? null,
    submittedAt: formatSubmittedAt(s.submittedAt),
    status: s.status === "GRADED" ? "GRADED" : "SUBMITTED",
  };
}

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

  // Load the role-aware submission history from the backend. Demo mode keeps
  // mock data so the page is still browsable without a server.
  const { data: liveSubmissionsData, isLoading: isLoadingSubmissions, refetch: refetchSubmissions } =
    useFetchData<SubmissionRow[]>(
      () =>
        submissionsApi
          .findAll()
          .then((res) =>
            Array.isArray(res.data) ? res.data.map(toSubmissionRow) : [],
          ),
      [],
      !isDemoMode,
    );
  const liveSubmissions = liveSubmissionsData ?? [];

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
      // Refresh the history list so the row's score/status reflects the new grade
      refetchSubmissions();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to grade submission";
      setFeedbackMsg(message);
    }
  };

  const displaySubmissions = isDemoMode
    ? getMockSubmissions(currentRole)
    : liveSubmissions;

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
    isLoadingSubmissions,
  };
}
