import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { assessmentSchema } from "@/lib/schemas";
import { useAssessmentStore } from "@/stores/use-assessment-store";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  assessmentsApi,
  teachingAssignmentsApi,
  subjectsApi,
} from "@/lib/api-client";
import { useSchoolContextStore } from "@/stores/use-school-context-store";
import { getErrorMessage } from "@/lib/errors";
import { CreateAssessmentDto, TeachingAssignment, SubTopic } from "@/types";

/**
 * Form data for step 1 (assessment details).
 * Matches backend CreateAssessmentDto minus nested questions.
 */
export type AssessmentFormData = Pick<
  CreateAssessmentDto,
  "teachingAssignmentId" | "title" | "description" | "type" | "dueAt"
>;

export interface NewQuestionOption {
  text: string;
  isCorrect: boolean;
}

// Sensible defaults per question type so teacher always has
// exactly one correct answer pre-selected.
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

/**
 * Two-step create flow:
 *  1. Details (assignment + title + type + due date) -> saved to draft store
 *  2. Questions (local draft list) -> single POST on publish
 *
 * Backend contract (POST /assessments):
 *   { teachingAssignmentId, title, description?, type, dueAt?, questions?[] }
 * Each question: { subTopicId, type, question, points?, order?, options?[] }
 * Each option: { text, isCorrect? }
 */
export function useNewAssessmentForm() {
  const router = useRouter();
  const { user, isDemoMode } = useAuthStore();
  const {
    draft,
    updateDraft,
    addQuestionToDraft,
    removeQuestionFromDraft,
    resetDraft,
  } = useAssessmentStore();

  const [activeStep, setActiveStep] = React.useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [assignments, setAssignments] = React.useState<TeachingAssignment[]>(
    [],
  );
  const [selectedAssignmentId, setSelectedAssignmentId] =
    React.useState<string>(draft.teachingAssignmentId || "");
  const [subTopics, setSubTopics] = React.useState<SubTopic[]>([]);
  const [selectedSubTopicId, setSelectedSubTopicId] =
    React.useState<string>("");

  const [qText, setQText] = React.useState("");
  const [qType, setQType] = React.useState<
    "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"
  >("MCQ");
  const [qPoints, setQPoints] = React.useState(10);
  const [options, setOptions] =
    React.useState<NewQuestionOption[]>(DEFAULT_OPTIONS);

  // Reset options when type changes so stale MCQ options
  // don't leak into TRUE_FALSE / SHORT_ANSWER.
  const handleChangeQType = (value: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER") => {
    setQType(value);
    if (value === "MCQ") {
      setOptions(DEFAULT_OPTIONS);
    } else if (value === "TRUE_FALSE") {
      setOptions(TRUE_FALSE_OPTIONS);
    } else {
      setOptions([]);
    }
  };

  // Load teacher assignments once (not on selectedAssignmentId change —
  // that caused a refetch loop in the old version).
  React.useEffect(() => {
    if (isDemoMode) return;
    let cancelled = false;
    teachingAssignmentsApi
      .findByTeacher(user?.id)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setAssignments(list);
        if (list.length > 0) {
          setSelectedAssignmentId((prev) => prev || list[0].id);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isDemoMode, user?.id]);

  // Load subtopics once per active school for the question form.
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
        // Flatten subject -> topic -> subTopic into one select list
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

  const methods = useForm<AssessmentFormData>({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      teachingAssignmentId:
        draft.teachingAssignmentId ||
        selectedAssignmentId ||
        "demo-assignment-id",
      title: draft.title || "",
      description: draft.description || "",
      type: draft.type || "QUIZ",
      dueAt: draft.dueAt || "",
    },
  });

  const handleStep1Submit = (data: AssessmentFormData) => {
    const assignmentId =
      selectedAssignmentId || data.teachingAssignmentId || "demo-assignment-id";
    updateDraft({
      teachingAssignmentId: assignmentId,
      title: data.title,
      description: data.description ?? "",
      type: data.type,
      dueAt: data.dueAt ?? "",
    });
    setActiveStep(2);
  };

  const resetQuestionCreator = () => {
    setQText("");
    setOptions(DEFAULT_OPTIONS);
    setQType("MCQ");
    setQPoints(10);
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    // Live mode requires a real subTopicId (backend FK, no demo fallback).
    if (!isDemoMode && !selectedSubTopicId) {
      setErrorMsg("Select a sub-topic before adding a question.");
      return;
    }
    const subTopicId = selectedSubTopicId || "demo-subtopic-id";

    addQuestionToDraft({
      subTopicId,
      question: qText,
      type: qType,
      points: Number(qPoints) || 10,
      // SHORT_ANSWER has no options; omit so backend skips nested create
      options: qType === "SHORT_ANSWER" ? [] : options,
      // order defaults to list length so findOne orderBy order stays stable
      order: draft.questions.length,
    });

    resetQuestionCreator();
  };

  const handleFinalPublish = async () => {
    try {
      setErrorMsg(null);
      setIsSubmitting(true);
      const assignmentId =
        selectedAssignmentId ||
        draft.teachingAssignmentId ||
        "demo-assignment-id";

      if (!isDemoMode) {
        if (!assignmentId || assignmentId === "demo-assignment-id") {
          throw new Error("Select a teaching assignment first.");
        }
        await assessmentsApi.create({
          teachingAssignmentId: assignmentId,
          title: draft.title,
          description: draft.description,
          type: draft.type,
          dueAt: draft.dueAt || undefined,
          questions: draft.questions.map((q, idx) => ({
            subTopicId: q.subTopicId || selectedSubTopicId,
            type: q.type,
            question: q.question,
            points: q.points,
            order: q.order ?? idx,
            options: q.options,
          })),
        });
      }

      resetDraft();
      router.push("/assessments");
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to publish assessment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    isDemoMode,
    activeStep,
    isSubmitting,
    errorMsg,
    assignments,
    selectedAssignmentId,
    setSelectedAssignmentId,
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
    draft,
    handleStep1Submit,
    handleAddQuestion,
    handleFinalPublish,
    removeQuestionFromDraft,
  };
}
