"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAssessmentPlayer } from "./hooks";
import { QuizHeaderBar } from "./_components/QuizHeaderBar";
import { CompletionCard } from "./_components/CompletionCard";
import { QuestionCard } from "./_components/QuestionCard";

export default function AssessmentPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string;
  const { user, isDemoMode } = useAuthStore();

  const {
    assessment,
    isLoading,
    errorMsg,
    questionsList,
    currentIdx,
    currentQ,
    progressPercent,
    timeFormatted,
    isSubmitted,
    calculatedScore,
    isSubmittingApi,
    selectedAnswers,
    handleSelectOption,
    goToPrevQuestion,
    goToNextQuestion,
    handleSubmitQuiz,
    resetQuiz,
  } = useAssessmentPlayer({ assessmentId, isDemoMode, userRole: user?.role });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading assessment details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <QuizHeaderBar
        onBack={() => router.push("/assessments")}
        timeFormatted={timeFormatted}
        currentIdx={currentIdx}
        totalQuestions={questionsList.length}
      />

      <Progress value={progressPercent} className="h-2" />

      {isSubmitted ? (
        <CompletionCard
          calculatedScore={calculatedScore}
          onTryAgain={resetQuiz}
          onReturnToDashboard={() => router.push("/dashboard")}
        />
      ) : currentQ ? (
        <QuestionCard
          assessmentTitle={assessment?.title}
          question={currentQ}
          selectedAnswer={selectedAnswers[currentQ.id]}
          onSelectOption={handleSelectOption}
          currentIdx={currentIdx}
          totalQuestions={questionsList.length}
          onPrev={goToPrevQuestion}
          onNext={goToNextQuestion}
          onSubmit={handleSubmitQuiz}
          isSubmittingApi={isSubmittingApi}
        />
      ) : null}
    </div>
  );
}
