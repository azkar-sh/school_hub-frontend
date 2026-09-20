import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { submissionsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { getErrorMessage } from "@/lib/errors";
import { getMockSubmissionDetail, getMockSubmissions } from "@/lib/mock-data";
import { Submission, Answer } from "@/types";

export function useSubmissionDetailPage(submissionId: string) {
  const { user, isDemoMode } = useAuthStore();
  const currentRole = user?.role || "STUDENT";

  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Manual grading state for teachers
  const [gradeAnswerId, setGradeAnswerId] = React.useState("");
  const [gradePoints, setGradePoints] = React.useState<number>(0);
  const [demoSubmission, setDemoSubmission] = React.useState<Submission | null>(
    null,
  );

  // Initialize demo submission
  React.useEffect(() => {
    if (isDemoMode && submissionId) {
      setDemoSubmission(getMockSubmissionDetail(submissionId));
    }
  }, [isDemoMode, submissionId]);

  const {
    data: liveSubmission,
    isLoading,
    refetch,
  } = useFetchData<Submission>(
    () => submissionsApi.findOne(submissionId).then((res) => res.data),
    [submissionId],
    !isDemoMode && !!submissionId,
  );

  const activeSubmission = isDemoMode ? demoSubmission : (liveSubmission ?? null);

  // Inter-student navigation state
  const { data: allLiveSubmissions } = useFetchData(
    () => submissionsApi.findAll().then((res) => res.data),
    [],
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN"),
  );

  const submissionList = React.useMemo(() => {
    if (isDemoMode) {
      return getMockSubmissions(currentRole);
    }
    return Array.isArray(allLiveSubmissions) ? allLiveSubmissions : [];
  }, [isDemoMode, currentRole, allLiveSubmissions]);

  const { currentIndex, totalSubmissions, prevSubmissionId, nextSubmissionId, nextPendingSubmissionId } =
    React.useMemo(() => {
      const idx = submissionList.findIndex((s: { id: string }) => s.id === submissionId);
      const total = submissionList.length;
      const prev = idx > 0 ? submissionList[idx - 1].id : null;
      const next = idx >= 0 && idx < total - 1 ? submissionList[idx + 1].id : null;

      // Find next pending submission
      let nextPending: string | null = null;
      if (idx >= 0) {
        for (let i = idx + 1; i < total; i++) {
          if (submissionList[i].status === "SUBMITTED") {
            nextPending = submissionList[i].id;
            break;
          }
        }
        if (!nextPending) {
          for (let i = 0; i < idx; i++) {
            if (submissionList[i].status === "SUBMITTED") {
              nextPending = submissionList[i].id;
              break;
            }
          }
        }
      }

      return {
        currentIndex: idx,
        totalSubmissions: total,
        prevSubmissionId: prev,
        nextSubmissionId: next,
        nextPendingSubmissionId: nextPending,
      };
    }, [submissionList, submissionId]);

  const startGradingAnswer = (answerId: string, currentPoints?: number) => {
    setGradeAnswerId(answerId);
    setGradePoints(currentPoints ?? 0);
  };

  const cancelGradingAnswer = () => setGradeAnswerId("");

  const handleQuickGrade = async (answerId: string, points: number) => {
    if (!activeSubmission) return;
    try {
      if (isDemoMode) {
        // Update local demo state
        setDemoSubmission((prev) => {
          if (!prev) return null;
          const updatedAnswers = (prev.answers ?? []).map((ans) =>
            ans.id === answerId ? { ...ans, pointsEarned: points } : ans,
          );
          const totalEarned = updatedAnswers.reduce(
            (acc, a) => acc + (a.pointsEarned ?? 0),
            0,
          );
          const totalPossible = updatedAnswers.reduce(
            (acc, a) => acc + (a.question?.points ?? 0),
            0,
          );
          const pct =
            totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 100;
          return {
            ...prev,
            answers: updatedAnswers,
            score: totalEarned,
            scorePercentage: pct,
            status: updatedAnswers.some((a) => a.pointsEarned === null)
              ? "SUBMITTED"
              : "GRADED",
          };
        });
        setFeedbackMsg(`Awarded ${points} points!`);
        setGradeAnswerId("");
        return;
      }

      await submissionsApi.grade(activeSubmission.id, {
        grades: [{ answerId, pointsEarned: Number(points) || 0 }],
      });
      setFeedbackMsg(`Saved ${points} points!`);
      setGradeAnswerId("");
      refetch();
    } catch (err: unknown) {
      setFeedbackMsg(getErrorMessage(err, "Failed to grade answer"));
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission || !gradeAnswerId) return;
    await handleQuickGrade(gradeAnswerId, Number(gradePoints) || 0);
  };

  const [autoGrading, setAutoGrading] = React.useState(false);

  const handleAutoGradeSubmission = async () => {
    if (!activeSubmission || isDemoMode) return;
    setAutoGrading(true);
    try {
      await submissionsApi.autoGrade(activeSubmission.id);
      setFeedbackMsg("Submission auto-graded successfully!");
      refetch();
    } catch (err: unknown) {
      setFeedbackMsg(getErrorMessage(err, "Failed to auto-grade submission"));
    } finally {
      setAutoGrading(false);
    }
  };

  return {
    currentRole,
    isDemoMode,
    submission: activeSubmission,
    isLoading: isDemoMode ? false : isLoading,
    feedbackMsg,
    setFeedbackMsg,
    gradeAnswerId,
    gradePoints,
    setGradePoints,
    startGradingAnswer,
    cancelGradingAnswer,
    handleGradeSubmission,
    handleQuickGrade,
    handleAutoGradeSubmission,
    autoGrading,
    currentIndex,
    totalSubmissions,
    prevSubmissionId,
    nextSubmissionId,
    nextPendingSubmissionId,
  };
}

