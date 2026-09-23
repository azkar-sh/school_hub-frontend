"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useSubmissionDetailPage } from "./hooks";
import { SubmissionDetailCard } from "../_components/SubmissionDetailCard";

export default function SubmissionDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading submission…</span>
        </div>
      }
    >
      <SubmissionDetailContent />
    </React.Suspense>
  );
}

function SubmissionDetailContent() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.id as string;

  const {
    currentRole,
    isDemoMode,
    submission,
    isLoading,
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
  } = useSubmissionDetailPage(submissionId);

  const isTeacher = currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";

  // Keyboard navigation shortcuts for SpeedGrader
  React.useEffect(() => {
    if (!isTeacher) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is actively typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "[" && prevSubmissionId) {
        router.push(`/submissions/${prevSubmissionId}${navQueryString}`);
      } else if (e.key === "]" && nextSubmissionId) {
        router.push(`/submissions/${nextSubmissionId}${navQueryString}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTeacher, prevSubmissionId, nextSubmissionId, navQueryString, router]);

  const pendingAutoCount = React.useMemo(() => {
    const answers = submission?.answers ?? [];
    return answers.filter(
      (a) =>
        (a.question?.type === "MCQ" || a.question?.type === "TRUE_FALSE") &&
        (a.pointsEarned === null || a.pointsEarned === undefined),
    ).length;
  }, [submission]);

  const hasPendingAuto = pendingAutoCount > 0;
  const bottomPad = isTeacher
    ? hasPendingAuto
      ? "pb-36 sm:pb-6"
      : totalSubmissions > 0
        ? "pb-24 sm:pb-6"
        : "pb-6"
    : "pb-6";

  return (
    <div className={`space-y-4 sm:space-y-6 ${bottomPad}`}>
      {isDemoMode && <DemoModeBanner />}

      {/* Top Header & SpeedGrader Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
        <Link
          href="/submissions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions</span>
        </Link>

        {isTeacher && totalSubmissions > 0 && (
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 border-t sm:border-t-0 pt-2.5 sm:pt-0">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              {currentIndex >= 0 ? currentIndex + 1 : 1}/{totalSubmissions}
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                disabled={!prevSubmissionId}
                onClick={() =>
                  prevSubmissionId &&
                  router.push(`/submissions/${prevSubmissionId}${navQueryString}`)
                }
                title="Previous Student (Shortcut: [)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Prev</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                disabled={!nextSubmissionId}
                onClick={() =>
                  nextSubmissionId &&
                  router.push(`/submissions/${nextSubmissionId}${navQueryString}`)
                }
                title="Next Student (Shortcut: ])"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>

              {nextPendingSubmissionId && (
                <Button
                  variant="role"
                  size="sm"
                  className="h-8 px-3 text-xs font-bold gap-1 shadow-xs"
                  onClick={() =>
                    router.push(`/submissions/${nextPendingSubmissionId}${navQueryString}`)
                  }
                  title="Jump to Next Student Awaiting Grading"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Next Pending</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <span>{feedbackMsg}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading submission…</span>
        </div>
      )}

      {!isLoading && !submission && (
        <div className="py-16 text-center text-sm text-muted-foreground bg-card rounded-2xl border border-border/50">
          Submission not found or you are not authorized to view it.
        </div>
      )}

{submission && (!isLoading || isDemoMode) && (
         <SubmissionDetailCard
           submission={submission}
           currentRole={currentRole}
           gradeAnswerId={gradeAnswerId}
           gradePoints={gradePoints}
           onChangeGradePoints={setGradePoints}
           onStartGrading={startGradingAnswer}
           onCancelGrading={cancelGradingAnswer}
           onSubmitGrade={handleGradeSubmission}
           onQuickGrade={handleQuickGrade}
           onAutoGrade={handleAutoGradeSubmission}
           autoGrading={autoGrading}
         />
       )}

      {/* Sticky Auto-Grade Button on Mobile (above bottom nav) */}
      {isTeacher && hasPendingAuto && !autoGrading && (
        <div className="fixed bottom-20 left-3 right-3 sm:hidden z-30">
          <Button
            variant="default"
            size="lg"
            className="w-full min-h-[52px] text-sm font-bold gap-2 shadow-xl"
            onClick={handleAutoGradeSubmission}
            disabled={autoGrading}
            isLoading={autoGrading}
          >
            <Wand2 className="w-4 h-4" />
            Auto-grade {pendingAutoCount} MCQ / TF
          </Button>
        </div>
      )}

      {/* Sticky Bottom Floating Bar on Mobile for 1-Thumb Phone Grading */}
      {isTeacher && totalSubmissions > 0 && (
        <div className="fixed bottom-3 left-3 right-3 sm:hidden z-40 bg-card/95 backdrop-blur-md border border-border/80 p-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 text-xs flex-1 min-h-[44px]"
            disabled={!prevSubmissionId}
            onClick={() =>
              prevSubmissionId &&
              router.push(`/submissions/${prevSubmissionId}${navQueryString}`)
            }
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>

          <span className="text-[11px] font-bold text-muted-foreground px-1">
            {currentIndex >= 0 ? currentIndex + 1 : 1}/{totalSubmissions}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 text-xs flex-1 min-h-[44px]"
            disabled={!nextSubmissionId}
            onClick={() =>
              nextSubmissionId &&
              router.push(`/submissions/${nextSubmissionId}${navQueryString}`)
            }
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          {nextPendingSubmissionId && (
            <Button
              variant="role"
              size="sm"
              className="h-10 px-3 text-xs font-bold min-h-[44px]"
              onClick={() =>
                router.push(`/submissions/${nextPendingSubmissionId}${navQueryString}`)
              }
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
