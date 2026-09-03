import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { submissionsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { getErrorMessage } from "@/lib/errors";
import { Submission } from "@/types";

export function useSubmissionDetailPage(submissionId: string) {
  const { user, isDemoMode } = useAuthStore();
  const currentRole = user?.role || "STUDENT";

  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Manual grading state for teachers
  const [gradeAnswerId, setGradeAnswerId] = React.useState("");
  const [gradePoints, setGradePoints] = React.useState<number>(0);

  const {
    data: submission,
    isLoading,
    refetch,
  } = useFetchData<Submission>(
    () => submissionsApi.findOne(submissionId).then((res) => res.data),
    [submissionId],
    !isDemoMode && !!submissionId,
  );

  const startGradingAnswer = (answerId: string, currentPoints?: number) => {
    setGradeAnswerId(answerId);
    setGradePoints(currentPoints ?? 0);
  };

  const cancelGradingAnswer = () => setGradeAnswerId("");

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission || !gradeAnswerId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Grade updated in demo mode");
        setGradeAnswerId("");
        return;
      }
      await submissionsApi.grade(submission.id, {
        grades: [
          { answerId: gradeAnswerId, pointsEarned: Number(gradePoints) || 0 },
        ],
      });
      setFeedbackMsg("Submission grade updated successfully!");
      setGradeAnswerId("");
      refetch();
    } catch (err: unknown) {
      setFeedbackMsg(getErrorMessage(err, "Failed to grade submission"));
    }
  };

  return {
    currentRole,
    isDemoMode,
    submission: submission ?? null,
    isLoading,
    feedbackMsg,
    setFeedbackMsg,
    gradeAnswerId,
    gradePoints,
    setGradePoints,
    startGradingAnswer,
    cancelGradingAnswer,
    handleGradeSubmission,
  };
}
