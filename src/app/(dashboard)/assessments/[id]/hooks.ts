import * as React from "react";
import { useAssessmentStore } from "@/stores/use-assessment-store";
import { assessmentsApi, submissionsApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { Assessment, Submission } from "@/types";
import { mockQuestions } from "./mock-questions";

const QUIZ_DURATION_SECONDS = 600; // 10 minutes

interface UseAssessmentPlayerArgs {
  assessmentId: string;
  isDemoMode: boolean;
  userRole?: string;
}

export function useAssessmentPlayer({
  assessmentId,
  isDemoMode,
  userRole,
}: UseAssessmentPlayerArgs) {
  const { selectedAnswers, setAnswer, clearAnswers } = useAssessmentStore();

  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [submission, setSubmission] = React.useState<Submission | null>(null);

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(QUIZ_DURATION_SECONDS);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [calculatedScore, setCalculatedScore] = React.useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = React.useState(
    !isDemoMode && !!assessmentId,
  );
  const [isSubmittingApi, setIsSubmittingApi] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch assessment & start submission for real users
  React.useEffect(() => {
    if (isDemoMode || !assessmentId) return;

    assessmentsApi
      .findOne(assessmentId)
      .then(async (res) => {
        const data = res.data;
        setAssessment(data);
        setErrorMsg(null);

        // Start submission attempt if student
        if (userRole === "STUDENT") {
          try {
            const subRes = await submissionsApi.start({ assessmentId });
            setSubmission(subRes.data);
          } catch {
            // submission might already exist
          }
        }
      })
      .catch((error: unknown) => {
        setErrorMsg(
          getErrorMessage(error, "Failed to load assessment questions."),
        );
      })
      .finally(() => setIsLoading(false));
  }, [isDemoMode, assessmentId, userRole]);

  // Questions source: backend assessment questions if available, else mock questions
  const questionsList =
    !isDemoMode && assessment?.questions && assessment.questions.length > 0
      ? assessment.questions
      : mockQuestions;

  // Timer Countdown Effect
  React.useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const currentQ = questionsList[currentIdx];
  const progressPercent =
    questionsList.length > 0
      ? ((currentIdx + 1) / questionsList.length) * 100
      : 0;

  const handleSelectOption = (questionId: string, answerText: string) => {
    if (isSubmitted) return;
    setAnswer(questionId, answerText);
  };

  const goToPrevQuestion = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goToNextQuestion = () => setCurrentIdx((i) => i + 1);

  const resetQuiz = () => {
    setIsSubmitted(false);
    clearAnswers();
    setCurrentIdx(0);
  };

  const handleSubmitQuiz = async () => {
    if (isDemoMode || !submission?.id) {
      // Client side calculation for demo mode
      let earned = 0;
      let totalPossible = 0;

      mockQuestions.forEach((q) => {
        totalPossible += q.points;
        const selected = selectedAnswers[q.id];
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (
          selected &&
          (selected === correctOpt?.id || selected === correctOpt?.text)
        ) {
          earned += q.points;
        }
      });

      const scorePct = (earned / totalPossible) * 100;
      setCalculatedScore(scorePct);
      setIsSubmitted(true);
      return;
    }

    try {
      setIsSubmittingApi(true);
      setErrorMsg(null);

      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([qId, val]) => ({
          questionId: qId,
          answer: val,
        }),
      );

      const res = await submissionsApi.submit(submission.id, {
        answers: formattedAnswers,
      });

      const updatedSub = res.data;
      setSubmission(updatedSub);

      const numericScore =
        updatedSub?.score !== undefined && updatedSub?.score !== null
          ? Number(updatedSub.score)
          : 0;
      setCalculatedScore(numericScore);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to submit quiz attempt."));
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return {
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
  };
}
