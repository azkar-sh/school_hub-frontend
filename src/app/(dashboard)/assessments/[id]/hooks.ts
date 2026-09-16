/**
 * Assessment detail hooks — two modes:
 *  1. Student player (take + submit + review)
 *  2. Teacher manage (add / edit / delete questions)
 *
 * Backend contracts used here (see assessments.service.ts):
 *  GET  /assessments/:id                    -> Assessment with questions (role-filtered)
 *  POST /assessments/:id/questions          -> Question (needs teacher ownership)
 *  PUT  /assessments/:id/questions/:qId     -> Question (blocked if submissions exist)
 *  DELETE /assessments/:id/questions/:qId   -> { id, deleted }
 *  POST /submissions/start  { assessmentId }-> Submission (DRAFT)
 *  POST /submissions/:id/submit { answers } -> Submission (GRADED if auto-grade)
 *  GET  /submissions/:id                    -> Submission with answers
 *
 * Learn: Prisma ownership guard lives in backend verifyTeacherOwnership;
 * frontend just surfaces its 403/400 as getErrorMessage.
 */

import * as React from "react";
import { useAssessmentStore } from "@/stores/use-assessment-store";
import {
  assessmentsApi,
  submissionsApi,
  subjectsApi,
} from "@/lib/api-client";
import { useSchoolContextStore } from "@/stores/use-school-context-store";
import { getErrorMessage } from "@/lib/errors";
import { Assessment, Submission, SubTopic } from "@/types";
import { mockQuestions } from "./mock-questions";

const QUIZ_DURATION_SECONDS = 600;

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
  // Full submission for review mode (includes answers + question snapshots)
  const [reviewSubmission, setReviewSubmission] = React.useState<Submission | null>(null);

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

  // Load assessment; if STUDENT, start (or resume) submission.
  React.useEffect(() => {
    if (isDemoMode || !assessmentId) return;
    let cancelled = false;

    assessmentsApi
      .findOne(assessmentId)
      .then(async (res) => {
        if (cancelled) return;
        const data = res.data;
        setAssessment(data);
        setErrorMsg(null);

        if (userRole === "STUDENT") {
          try {
            const subRes = await submissionsApi.start({ assessmentId });
            const sub = subRes.data;
            if (cancelled) return;
            setSubmission(sub);

            // Already submitted/graded -> fetch full review payload
            // so ReviewResults can render without extra navigation.
            if (sub.status === "SUBMITTED" || sub.status === "GRADED") {
              try {
                const full = await submissionsApi.findOne(sub.id);
                if (!cancelled) setReviewSubmission(full.data);
              } catch {
                // Non-fatal: keep player fallback
              }
            }
          } catch {
            // start may 409 if submission already exists — ignore
          }
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMsg(
          getErrorMessage(error, "Failed to load assessment questions."),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isDemoMode, assessmentId, userRole]);

  // Backend questions first; mock fallback for demo / empty assessment
  const questionsList =
    !isDemoMode && assessment?.questions && assessment.questions.length > 0
      ? assessment.questions
      : mockQuestions;

  // Simple countdown — stops on submit or when it hits 0
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
    // Demo or no submission id -> local grading from mockQuestions
    if (isDemoMode || !submission?.id) {
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

      const scorePct = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;
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
      try {
        const full = await submissionsApi.findOne(updatedSub.id);
        setReviewSubmission(full.data);
      } catch {
        // Review fetch is best-effort
      }

      // Backend score is raw points; convert to percent for CompletionCard
      const earned =
        updatedSub?.score !== undefined && updatedSub?.score !== null
          ? Number(updatedSub.score)
          : 0;
      const totalPossible = questionsList.reduce(
        (sum, q) => sum + (q.points ?? 0),
        0,
      );
      const pct = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;
      setCalculatedScore(pct);
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

  const reviewMode =
    !isDemoMode &&
    !!reviewSubmission &&
    (reviewSubmission.status === "SUBMITTED" ||
      reviewSubmission.status === "GRADED");

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
    reviewMode,
    reviewSubmission,
  };
}

// ---------------------------------------------------------------------------
// Teacher: Manage Questions
// ---------------------------------------------------------------------------

interface NewQuestionOption {
  text: string;
  isCorrect: boolean;
}

const DEFAULT_OPTIONS: NewQuestionOption[] = [
  { text: "Option A", isCorrect: true },
  { text: "Option B", isCorrect: false },
  { text: "Option C", isCorrect: false },
  { text: "Option D", isCorrect: false },
];

const TRUE_FALSE_OPTIONS: NewQuestionOption[] = [
  { text: "True", isCorrect: true },
  { text: "False", isCorrect: false },
];

interface UseManageQuestionsArgs {
  assessmentId: string;
  isDemoMode: boolean;
}

export function useManageQuestions({
  assessmentId,
  isDemoMode,
}: UseManageQuestionsArgs) {
  const [assessment, setAssessment] = React.useState<Assessment | null>(() => {
    if (!isDemoMode || !assessmentId) return null;
    return {
      id: assessmentId,
      title: "Demo Assessment — Math Practice",
      type: "QUIZ",
      dueAt: undefined,
      questions: mockQuestions.map((q) => ({
        id: q.id,
        assessmentId,
        type: q.type,
        question: q.question,
        points: q.points,
        order: 0,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    };
  });
  const [isLoading, setIsLoading] = React.useState(!isDemoMode && !!assessmentId);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = React.useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = React.useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = React.useState(false);
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);

  const [subTopics, setSubTopics] = React.useState<SubTopic[]>([]);
  const [selectedSubTopicId, setSelectedSubTopicId] = React.useState("");

  const [qText, setQText] = React.useState("");
  const [qType, setQType] = React.useState<
    "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"
  >("MCQ");
  const [qPoints, setQPoints] = React.useState(10);
  const [options, setOptions] =
    React.useState<NewQuestionOption[]>(DEFAULT_OPTIONS);

  const fetchAssessment = React.useCallback(() => {
    if (isDemoMode || !assessmentId) return;
    setIsLoading(true);
    assessmentsApi
      .findOne(assessmentId)
      .then((res) => {
        setAssessment(res.data);
        setErrorMsg(null);
      })
      .catch((error: unknown) => {
        setErrorMsg(
          getErrorMessage(error, "Failed to load assessment details."),
        );
      })
      .finally(() => setIsLoading(false));
  }, [isDemoMode, assessmentId]);

  React.useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Subtopics for question form (flatten subject -> topic -> subTopic)
  React.useEffect(() => {
    if (isDemoMode) return;
    const activeSchoolId = useSchoolContextStore.getState().activeSchoolId;
    if (!activeSchoolId) return;
    let cancelled = false;
    subjectsApi
      .findSubjectsBySchool(activeSchoolId)
      .then((res) => {
        if (cancelled) return;
        const subs = Array.isArray(res.data) ? res.data : [];
        const allSubTopics: SubTopic[] = [];
        subs.forEach((sub) => {
          sub.topics?.forEach((top) => {
            top.subTopics?.forEach((st) => {
              allSubTopics.push(st);
            });
          });
        });
        setSubTopics(allSubTopics);
        if (allSubTopics.length > 0) setSelectedSubTopicId(allSubTopics[0].id);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isDemoMode]);

  const handleChangeQType = (
    value: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER",
  ) => {
    setQType(value);
    if (value === "MCQ") {
      setOptions(DEFAULT_OPTIONS);
    } else if (value === "TRUE_FALSE") {
      setOptions(TRUE_FALSE_OPTIONS);
    } else {
      setOptions([]);
    }
  };

  const resetQuestionCreator = () => {
    setQText("");
    setOptions(DEFAULT_OPTIONS);
    setQType("MCQ");
    setQPoints(10);
  };

  const handleAddQuestion = async () => {
    if (!qText.trim() || isDemoMode) return;
    if (!selectedSubTopicId) {
      setErrorMsg("Select a sub-topic before adding a question.");
      return;
    }

    try {
      setIsAddingQuestion(true);
      setErrorMsg(null);
      // POST /assessments/:id/questions { subTopicId, type, question, points, order, options }
      // Backend derives order from dto.order ?? 0; we send current count.
      await assessmentsApi.addQuestion(assessmentId, {
        subTopicId: selectedSubTopicId,
        type: qType,
        question: qText,
        points: Number(qPoints) || 10,
        order: assessment?.questions?.length ?? 0,
        options: qType === "SHORT_ANSWER" ? undefined : options,
      });
      resetQuestionCreator();
      fetchAssessment();
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to add question."));
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const startEditQuestion = (question: {
    id: string;
    question: string;
    type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
    points: number;
    options?: Array<{ text: string; isCorrect?: boolean }>;
  }) => {
    setEditingQuestionId(question.id);
    setQText(question.question);
    setQType(question.type);
    setQPoints(question.points);
    if (question.type === "MCQ") {
      setOptions(
        question.options && question.options.length > 0
          ? question.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect }))
          : DEFAULT_OPTIONS,
      );
    } else if (question.type === "TRUE_FALSE") {
      setOptions(
        question.options && question.options.length === 2
          ? question.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect }))
          : TRUE_FALSE_OPTIONS,
      );
    } else {
      setOptions([]);
    }
    setErrorMsg(null);
  };

  const cancelEdit = () => {
    setEditingQuestionId(null);
    resetQuestionCreator();
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestionId || !qText.trim() || isDemoMode) return;
    if (!selectedSubTopicId) {
      setErrorMsg("Select a sub-topic before saving.");
      return;
    }

    try {
      setIsSavingQuestion(true);
      setErrorMsg(null);
      // PUT /assessments/:id/questions/:questionId
      // Backend replaces options when provided; send [] to clear for SHORT_ANSWER
      await assessmentsApi.updateQuestion(assessmentId, editingQuestionId, {
        subTopicId: selectedSubTopicId,
        type: qType,
        question: qText,
        points: Number(qPoints) || 10,
        options: qType === "SHORT_ANSWER" ? [] : options,
      });
      cancelEdit();
      fetchAssessment();
    } catch (error) {
      // 400 "Cannot modify questions after students have started" surfaces here
      setErrorMsg(getErrorMessage(error, "Failed to save question."));
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (isDemoMode) return;
    try {
      setIsDeletingQuestion(true);
      setErrorMsg(null);
      await assessmentsApi.deleteQuestion(assessmentId, questionId);
      if (editingQuestionId === questionId) cancelEdit();
      fetchAssessment();
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to delete question."));
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  return {
    assessment,
    isLoading,
    errorMsg,
    isAddingQuestion,
    isSavingQuestion,
    isDeletingQuestion,
    editingQuestionId,
    subTopics,
    selectedSubTopicId,
    setSelectedSubTopicId,
    qText,
    setQText,
    qType,
    handleChangeQType,
    qPoints,
    setQPoints,
    options,
    setOptions,
    handleAddQuestion,
    startEditQuestion,
    cancelEdit,
    handleSaveQuestion,
    handleDeleteQuestion,
  };
}
