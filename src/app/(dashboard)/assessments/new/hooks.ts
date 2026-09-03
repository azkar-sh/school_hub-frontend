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

export type AssessmentFormData = Pick<
  CreateAssessmentDto,
  "teachingAssignmentId" | "title" | "description" | "type" | "dueAt"
>;

export interface NewQuestionOption {
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

  // Teaching Assignments & SubTopics selection state
  const [assignments, setAssignments] = React.useState<TeachingAssignment[]>(
    [],
  );
  const [selectedAssignmentId, setSelectedAssignmentId] =
    React.useState<string>(draft.teachingAssignmentId || "");
  const [subTopics, setSubTopics] = React.useState<SubTopic[]>([]);
  const [selectedSubTopicId, setSelectedSubTopicId] =
    React.useState<string>("");

  // Question Creator State
  const [qText, setQText] = React.useState("");
  const [qType, setQType] = React.useState<
    "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"
  >("MCQ");
  const [qPoints, setQPoints] = React.useState(10);
  const [options, setOptions] =
    React.useState<NewQuestionOption[]>(DEFAULT_OPTIONS);

  // When the question type changes, reset the options to a sensible default
  // so the teacher can mark the correct answer for the new type.
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

  // Load teaching assignments and subtopics for real users
  React.useEffect(() => {
    if (isDemoMode) return;
    teachingAssignmentsApi
      .findByTeacher(user?.id)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setAssignments(list);
        if (list.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(list[0].id);
        }
      })
      .catch(() => {});

    // Use the cached active school (the teacher's school) instead of always
    // picking the first school returned by findAll().
    const activeSchoolId = useSchoolContextStore.getState().activeSchoolId;
    if (!activeSchoolId) return;
    subjectsApi
      .findSubjectsBySchool(activeSchoolId)
      .then((res) => {
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
  }, [isDemoMode, user?.id, selectedAssignmentId]);

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
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    const subTopicId = selectedSubTopicId || "demo-subtopic-id";

    addQuestionToDraft({
      subTopicId,
      question: qText,
      type: qType,
      points: Number(qPoints) || 10,
      options: qType === "SHORT_ANSWER" ? [] : options,
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
        await assessmentsApi.create({
          teachingAssignmentId: assignmentId,
          title: draft.title,
          description: draft.description,
          type: draft.type,
          dueAt: draft.dueAt || undefined,
          questions: draft.questions.map((q) => ({
            subTopicId:
              q.subTopicId || selectedSubTopicId || "demo-subtopic-id",
            type: q.type,
            question: q.question,
            points: q.points,
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
