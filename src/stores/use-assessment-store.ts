import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Assessment, Question, Submission } from "@/types";

interface AssessmentDraft {
  teachingAssignmentId: string;
  title: string;
  description: string;
  type: "QUIZ" | "EXAM" | "ASSIGNMENT";
  dueAt: string;
  topicId?: string;
  questions: Array<{
    subTopicId: string;
    question: string;
    type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
    points: number;
    order?: number;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>;
}

interface AssessmentState {
  draft: AssessmentDraft;
  activeSubmission: Submission | null;
  selectedAnswers: Record<string, string>; // questionId -> answerText
  updateDraft: (data: Partial<AssessmentDraft>) => void;
  addQuestionToDraft: (question: AssessmentDraft["questions"][number]) => void;
  setQuestions: (questions: AssessmentDraft["questions"]) => void;
  removeQuestionFromDraft: (index: number) => void;
  resetDraft: () => void;
  setAnswer: (questionId: string, answer: string) => void;
  clearAnswers: () => void;
}

const initialDraft: AssessmentDraft = {
  teachingAssignmentId: "",
  title: "",
  description: "",
  type: "QUIZ",
  dueAt: "",
  topicId: undefined,
  questions: [],
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      activeSubmission: null,
      selectedAnswers: {},

      updateDraft: (data) =>
        set((state) => ({ draft: { ...state.draft, ...data } })),

      addQuestionToDraft: (question) =>
        set((state) => ({
          draft: {
            ...state.draft,
            questions: [...state.draft.questions, question],
          },
        })),

      setQuestions: (questions) =>
        set((state) => ({
          draft: {
            ...state.draft,
            questions,
          },
        })),

      removeQuestionFromDraft: (index) =>
        set((state) => ({
          draft: {
            ...state.draft,
            questions: state.draft.questions.filter((_, i) => i !== index),
          },
        })),

      resetDraft: () => set({ draft: initialDraft }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          selectedAnswers: { ...state.selectedAnswers, [questionId]: answer },
        })),

      clearAnswers: () => set({ selectedAnswers: {} }),
    }),
    {
      name: "assessment-draft-storage",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
