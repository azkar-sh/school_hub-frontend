"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  LayoutGrid,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssessmentPlayer } from "./hooks";
import { QuizHeaderBar } from "./_components/QuizHeaderBar";
import { CompletionCard } from "./_components/CompletionCard";
import { QuestionCard } from "./_components/QuestionCard";
import { QuestionPalette } from "./_components/QuestionPalette";
import { SubmitConfirmModal } from "./_components/SubmitConfirmModal";
import { ExitExamModal } from "./_components/ExitExamModal";
import { ReviewResults } from "./_components/ReviewResults";
import { ManageQuestionsView } from "./_components/ManageQuestionsView";
import { useTranslations } from "next-intl";

export default function AssessmentDetailPage() {
  const params = useParams();
  const assessmentId = params?.id as string;
  const { user, isDemoMode } = useAuthStore();

  // Teachers manage questions; students/parents take or review the assessment.
  if (user?.role === "TEACHER") {
    return (
      <ManageQuestionsView assessmentId={assessmentId} isDemoMode={isDemoMode} />
    );
  }

  return (
    <AssessmentPlayer
      assessmentId={assessmentId}
      isDemoMode={isDemoMode}
      userRole={user?.role}
    />
  );
}

function AssessmentPlayer({
  assessmentId,
  isDemoMode,
  userRole,
}: {
  assessmentId: string;
  isDemoMode: boolean;
  userRole?: string;
}) {
  const router = useRouter();
  const t = useTranslations("Assessments");
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = React.useState(false);

  const {
    assessment,
    isLoading,
    errorMsg,
    questionsList,
    currentIdx,
    currentQ,
    progressPercent,
    timeFormatted,
    timeLeft,
    isSubmitted,
    calculatedScore,
    isSubmittingApi,
    selectedAnswers,
    flaggedQuestionIds,
    toggleFlagQuestion,
    jumpToQuestion,
    handleSelectOption,
    goToPrevQuestion,
    goToNextQuestion,
    handleSubmitQuiz,
    resetQuiz,
    reviewMode,
    reviewSubmission,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isExitModalOpen,
    setIsExitModalOpen,
    answeredCount,
    flaggedCount,
    unansweredCount,
  } = useAssessmentPlayer({ assessmentId, isDemoMode, userRole });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>{t("loadingDetails")}</span>
      </div>
    );
  }

  // Student already submitted/graded — show review of grade + answers.
  if (reviewMode && reviewSubmission) {
    return (
      <ReviewResults
        submission={reviewSubmission}
        assessment={assessment}
        onBack={() => router.push("/assessments")}
      />
    );
  }

  // Completed in this session
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6">
        {isDemoMode && <DemoModeBanner />}
        <CompletionCard
          calculatedScore={calculatedScore}
          onTryAgain={resetQuiz}
          onReturnToDashboard={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  const questionIds = questionsList.map((q) => q.id);

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-24 lg:pb-8">
      {isDemoMode && <DemoModeBanner />}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CBT Top Header Bar */}
      <QuizHeaderBar
        assessmentTitle={assessment?.title}
        onOpenExitModal={() => setIsExitModalOpen(true)}
        timeFormatted={timeFormatted}
        timeLeft={timeLeft}
        currentIdx={currentIdx}
        totalQuestions={questionsList.length}
        onToggleMobilePalette={() => setIsMobilePaletteOpen(true)}
      />

      {/* Progress Bar */}
      <div className="px-1">
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Main 2-Column Assessment Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Question Card */}
        <div className="lg:col-span-8">
          {currentQ ? (
            <QuestionCard
              assessmentTitle={assessment?.title}
              question={currentQ}
              selectedAnswer={selectedAnswers[currentQ.id]}
              onSelectOption={handleSelectOption}
              isFlagged={flaggedQuestionIds.has(currentQ.id)}
              onToggleFlag={toggleFlagQuestion}
              currentIdx={currentIdx}
              totalQuestions={questionsList.length}
              onPrev={goToPrevQuestion}
              onNext={goToNextQuestion}
              onSubmit={() => setIsConfirmModalOpen(true)}
              isSubmittingApi={isSubmittingApi}
            />
          ) : null}
        </div>

        {/* Right Column: Question Palette (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <QuestionPalette
            totalQuestions={questionsList.length}
            currentIdx={currentIdx}
            selectedAnswers={selectedAnswers}
            flaggedQuestionIds={flaggedQuestionIds}
            questionIds={questionIds}
            onSelectQuestion={jumpToQuestion}
            onOpenSubmitModal={() => setIsConfirmModalOpen(true)}
            isSubmittingApi={isSubmittingApi}
          />
        </div>
      </div>

      {/* Sticky Bottom Floating Bar on Mobile for 1-Thumb Exam Navigation */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto lg:hidden z-40 bg-card/95 backdrop-blur-md border border-border/80 p-2 rounded-2xl shadow-xl flex items-center justify-between gap-2 box-border">
        {/* Previous Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={goToPrevQuestion}
          disabled={currentIdx === 0}
          className="w-10 h-10 p-0 text-xs font-semibold shrink-0 min-h-[40px] rounded-xl flex items-center justify-center"
          title={t("previous")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Question Palette Drawer Trigger */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsMobilePaletteOpen(true)}
          className="h-10 px-2.5 text-xs font-bold min-h-[40px] rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 flex items-center gap-1.5 shrink-0"
        >
          <LayoutGrid className="w-4 h-4 text-primary shrink-0" />
          <span>
            {currentIdx + 1}/{questionsList.length}
          </span>
        </Button>

        {/* Flag for Review (Ragu-ragu) Toggle */}
        <Button
          type="button"
          variant={currentQ && flaggedQuestionIds.has(currentQ.id) ? "default" : "outline"}
          size="sm"
          onClick={() => currentQ && toggleFlagQuestion(currentQ.id)}
          className={cn(
            "h-10 px-2.5 text-xs font-semibold min-h-[40px] rounded-xl gap-1.5 transition-all shrink-0 flex items-center",
            currentQ && flaggedQuestionIds.has(currentQ.id)
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs"
              : "border-border/80 text-muted-foreground hover:text-amber-600 hover:border-amber-400"
          )}
        >
          <Bookmark
            className={cn(
              "w-4 h-4 shrink-0",
              currentQ && flaggedQuestionIds.has(currentQ.id) && "fill-current"
            )}
          />
          <span className="text-xs">{t("flagShort")}</span>
        </Button>

        {/* Next or Finish Button */}
        {currentIdx < questionsList.length - 1 ? (
          <Button
            type="button"
            variant="role"
            size="sm"
            onClick={goToNextQuestion}
            className="flex-1 min-w-0 h-10 px-3 text-xs font-bold min-h-[40px] rounded-xl flex items-center justify-center gap-1"
          >
            <span className="truncate">{t("nextShort")}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="role"
            size="sm"
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex-1 min-w-0 h-10 px-3 text-xs font-bold min-h-[40px] rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t("finishShort")}</span>
          </Button>
        )}
      </div>

      {/* Mobile / Tablet Drawer for Question Palette */}
      <Sheet open={isMobilePaletteOpen} onOpenChange={setIsMobilePaletteOpen}>
        <SheetContent side="right" className="w-[85vw] sm:max-w-md p-4">
          <SheetHeader className="pb-2">
            <SheetTitle>{t("questionPalette")}</SheetTitle>
          </SheetHeader>
          <div className="pt-2">
            <QuestionPalette
              totalQuestions={questionsList.length}
              currentIdx={currentIdx}
              selectedAnswers={selectedAnswers}
              flaggedQuestionIds={flaggedQuestionIds}
              questionIds={questionIds}
              onSelectQuestion={(idx) => {
                jumpToQuestion(idx);
                setIsMobilePaletteOpen(false);
              }}
              onOpenSubmitModal={() => {
                setIsMobilePaletteOpen(false);
                setIsConfirmModalOpen(true);
              }}
              isSubmittingApi={isSubmittingApi}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Pre-Submission Safety Summary Modal */}
      <SubmitConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirmSubmit={() => {
          setIsConfirmModalOpen(false);
          handleSubmitQuiz();
        }}
        isSubmitting={isSubmittingApi}
        totalQuestions={questionsList.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        unansweredCount={unansweredCount}
      />

      {/* Exit Exam Warning Modal */}
      <ExitExamModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={() => {
          setIsExitModalOpen(false);
          router.push("/assessments");
        }}
      />
    </div>
  );
}
