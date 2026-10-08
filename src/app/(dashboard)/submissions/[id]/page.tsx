"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowDown,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useSubmissionDetailPage } from "./hooks";
import { SubmissionDetailCard } from "../_components/SubmissionDetailCard";
import { useTranslations } from "next-intl";

export default function SubmissionDetailPage() {
  const t = useTranslations("Submissions");
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingSubmission")}</span>
        </div>
      }
    >
      <SubmissionDetailContent />
    </React.Suspense>
  );
}

function SubmissionDetailContent() {
  const t = useTranslations("Submissions");
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

  // Tracks the first ungraded answer so teachers can jump straight to it while scrolling a long assessment
  const { totalGradableCount, gradedCount, firstPendingAnswerId } =
    React.useMemo(() => {
      const answers = submission?.answers ?? [];
      const gradable = answers.filter(
        (a) =>
          a.question?.type === "MCQ" ||
          a.question?.type === "TRUE_FALSE" ||
          a.question?.type === "SHORT_ANSWER",
      );
      const pending = gradable.filter(
        (a) => a.pointsEarned === null || a.pointsEarned === undefined,
      );
      return {
        totalGradableCount: gradable.length,
        gradedCount: gradable.length - pending.length,
        firstPendingAnswerId: pending[0]?.id ?? null,
      };
    }, [submission]);

  // Briefly pulses the jumped-to question so teachers can visually confirm where they landed
  const [highlightAnswerId, setHighlightAnswerId] = React.useState<
    string | null
  >(null);
  React.useEffect(() => {
    if (!highlightAnswerId) return;
    const t = setTimeout(() => setHighlightAnswerId(null), 1600);
    return () => clearTimeout(t);
  }, [highlightAnswerId]);

  const scrollToNextUngraded = React.useCallback(() => {
    if (!firstPendingAnswerId) return;
    document
      .getElementById(`answer-${firstPendingAnswerId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightAnswerId(firstPendingAnswerId);
  }, [firstPendingAnswerId]);

  // Single contextual action: jump to the next ungraded question in this submission,
  // or advance to the next student awaiting grading once this one is fully graded.
  const continueGrading = React.useMemo(() => {
    if (firstPendingAnswerId) {
      return {
        label: t("nextUngraded"),
        shortLabel: t("nextUngraded"),
        icon: <ArrowDown className="w-3.5 h-3.5" />,
        title: t("nextUngradedTooltip"),
        action: scrollToNextUngraded,
      };
    }
    if (nextPendingSubmissionId) {
      return {
        label: t("nextStudentToGrade"),
        shortLabel: t("nextStudentToGrade"),
        icon: <Sparkles className="w-3.5 h-3.5" />,
        title: t("nextStudentTooltip"),
        action: () =>
          router.push(
            `/submissions/${nextPendingSubmissionId}${navQueryString}`,
          ),
      };
    }
    return null;
  }, [
    firstPendingAnswerId,
    nextPendingSubmissionId,
    navQueryString,
    router,
    scrollToNextUngraded,
    t,
  ]);

  const bottomPad = isTeacher
    ? hasPendingAuto
    : totalSubmissions > 0
      ? "pb-24 sm:pb-6"
      : "pb-6";

  return (
    <div className={`space-y-4 sm:space-y-6 ${bottomPad}`}>
      {isDemoMode && <DemoModeBanner />}

      {/* Top Header & SpeedGrader Navigation Bar */}
      <div className="sticky top-2 z-30 flex flex-col gap-2.5 p-3 sm:p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border/70 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/submissions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("backToSubmissions")}</span>
          </Link>

          {isTeacher && totalSubmissions > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden md:inline">
                {t("student")} {currentIndex >= 0 ? currentIndex + 1 : 1}/
                {totalSubmissions}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                disabled={!prevSubmissionId}
                onClick={() =>
                  prevSubmissionId &&
                  router.push(
                    `/submissions/${prevSubmissionId}${navQueryString}`,
                  )
                }
                title={t("prevStudent")}
              >
                <ChevronLeft className="w-4 h-4" />
                <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] font-mono font-bold bg-muted border border-border/80 rounded text-muted-foreground leading-none">
                  [
                </kbd>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                disabled={!nextSubmissionId}
                onClick={() =>
                  nextSubmissionId &&
                  router.push(
                    `/submissions/${nextSubmissionId}${navQueryString}`,
                  )
                }
                title={t("nextStudent")}
              >
                <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] font-mono font-bold bg-muted border border-border/80 rounded text-muted-foreground leading-none">
                  ]
                </kbd>
                <ChevronRight className="w-4 h-4" />
              </Button>

              {continueGrading ? (
                <Button
                  variant="role"
                  size="sm"
                  className="h-8 px-3 text-xs font-bold gap-1.5 shadow-xs whitespace-nowrap"
                  onClick={continueGrading.action}
                  title={continueGrading.title}
                >
                  {continueGrading.icon}
                  <span className="hidden sm:inline">
                    {continueGrading.label}
                  </span>
                  <span className="sm:hidden">
                    {continueGrading.shortLabel}
                  </span>
                </Button>
              ) : (
                totalGradableCount > 0 && (
                  <Badge variant="success" className="gap-1 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hidden sm:inline">{t("allGraded")}</span>
                  </Badge>
                )
              )}
            </div>
          )}
        </div>

        {isTeacher && totalGradableCount > 0 && (
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 flex-1 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-info transition-all"
                style={{
                  width: `${Math.round((gradedCount / totalGradableCount) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
              {t("gradedCountBadge", {
                graded: gradedCount,
                total: totalGradableCount,
              })}
            </span>
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
          <span className="text-sm">{t("loadingSubmission")}</span>
        </div>
      )}

      {!isLoading && !submission && (
        <div className="py-16 text-center text-sm text-muted-foreground bg-card rounded-2xl border border-border/50">
          {t("submissionNotFound")}
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
          highlightAnswerId={highlightAnswerId}
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
            {t("autoGradeCount", { count: pendingAutoCount })}
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
            {/* Prev */}
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
            {/* Next */}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          {continueGrading ? (
            <Button
              variant="role"
              size="sm"
              className="h-10 px-3 text-xs font-bold min-h-[44px] gap-1.5"
              onClick={continueGrading.action}
              title={continueGrading.title}
            >
              {continueGrading.icon}
              <span className="">{continueGrading.shortLabel}</span>
            </Button>
          ) : (
            totalGradableCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="h-10 px-3 text-xs font-bold min-h-[44px] text-success gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
