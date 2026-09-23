import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { submissionsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { getErrorMessage } from "@/lib/errors";
import { getMockSubmissionDetail, getMockSubmissions } from "@/lib/mock-data";
import { Submission } from "@/types";

export function useSubmissionDetailPage(submissionId: string) {
  const { user, isDemoMode } = useAuthStore();
  const currentRole = user?.role || "STUDENT";
  const searchParams = useSearchParams();

  const subjectIdParam = searchParams.get("subjectId");
  const classIdParam = searchParams.get("classId");
  const subjectIds = React.useMemo(
    () => subjectIdParam?.split(",").filter(Boolean) ?? [],
    [subjectIdParam],
  );
  const classIds = React.useMemo(
    () => classIdParam?.split(",").filter(Boolean) ?? [],
    [classIdParam],
  );
  const navQueryString = React.useMemo(() => {
    const params = new URLSearchParams();
    if (subjectIdParam) params.set("subjectId", subjectIdParam);
    if (classIdParam) params.set("classId", classIdParam);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [subjectIdParam, classIdParam]);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Fetch grading queue for prev/next navigation using same filters as list page
  const {
    data: allLiveSubmissionsData,
    refetch: refetchList,
  } = useFetchData<{
    submissions: Submission[];
    meta: { total: number };
  }>(
    () =>
      submissionsApi
        .findAll({
          limit: 200,
          ...(subjectIds.length > 0 ? { subjectId: subjectIds } : {}),
          ...(classIds.length > 0 ? { classId: classIds } : {}),
        })
        .then((res) => res.data as unknown as {
          submissions: Submission[];
          meta: { total: number };
        }),
    [navQueryString],
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN"),
  );

  const submissionList = React.useMemo(() => {
    if (isDemoMode) {
      const all = getMockSubmissions(currentRole);
      if (subjectIds.length === 0) return all;
      // Demo subjects use names as filter values (same as list page)
      return all.filter((s) =>
        subjectIds.includes((s as { subject?: string }).subject ?? ""),
      );
    }
    return allLiveSubmissionsData?.submissions ?? [];
  }, [isDemoMode, currentRole, allLiveSubmissionsData, subjectIds]);

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
      refetchList();
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
      refetchList();
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
    navQueryString,
  };
}

