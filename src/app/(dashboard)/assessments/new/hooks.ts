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
import { CreateAssessmentDto, TeachingAssignment, SubTopic, Topic } from "@/types";

/**
 * Form data for step 1 (assessment details).
 * Matches backend CreateAssessmentDto minus nested questions.
 */
export type AssessmentFormData = Pick<
  CreateAssessmentDto,
  "teachingAssignmentId" | "title" | "description" | "type" | "dueAt" | "topicId"
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
  const [selectedTopicId, setSelectedTopicId] =
    React.useState<string | null>(draft.topicId ?? null);
  const [subTopics, setSubTopics] = React.useState<SubTopic[]>([]);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [selectedSubTopicId, setSelectedSubTopicId] =
    React.useState<string>(draft.questions?.[0]?.subTopicId || "");

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

  // Load topics for the selected assignment's subject (for optional topic selection)
  React.useEffect(() => {
    if (isDemoMode || !selectedAssignmentId) return;
    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    if (!assignment?.subjectId) return;
    let cancelled = false;
    subjectsApi
      .findTopicsBySubject(assignment.subjectId)
      .then((res) => {
        if (cancelled) return;
        setTopics(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isDemoMode, selectedAssignmentId, assignments]);

  // Load subtopics: if topic selected -> subtopics of that topic;
  // else -> all subtopics under assignment's subject
  React.useEffect(() => {
    if (isDemoMode) return;
    let cancelled = false;

    if (selectedTopicId) {
      // Topic scoped: fetch subtopics for this topic
      subjectsApi
        .findSubTopicsByTopic(selectedTopicId)
        .then((res) => {
          if (cancelled) return;
          setSubTopics(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {});
    } else if (selectedAssignmentId) {
      // Multi-topic: fetch all subtopics for assignment's subject
      const assignment = assignments.find((a) => a.id === selectedAssignmentId);
      if (assignment?.subjectId) {
        subjectsApi
          .findTopicsBySubject(assignment.subjectId)
          .then((res) => {
            if (cancelled) return;
            const allTopics = Array.isArray(res.data) ? res.data : [];
            const allSubTopics: SubTopic[] = [];
            allTopics.forEach((t) => {
              t.subTopics?.forEach((st) => allSubTopics.push(st));
            });
            setSubTopics(allSubTopics);
          })
          .catch(() => {});
      }
    }
    return () => {
      cancelled = true;
    };
  }, [isDemoMode, selectedAssignmentId, selectedTopicId, assignments]);

  // Sync selectedSubTopicId when subTopics list changes
  React.useEffect(() => {
    if (subTopics.length > 0) {
      setSelectedSubTopicId((prev) =>
        prev && subTopics.some((st) => st.id === prev) ? prev : subTopics[0].id,
      );
    } else {
      setSelectedSubTopicId("");
    }
  }, [subTopics]);

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
      topicId: draft.topicId ?? undefined,
    },
  });

  const handleStep1Submit = (data: AssessmentFormData) => {
    const assignmentId =
      selectedAssignmentId || data.teachingAssignmentId || "demo-assignment-id";
    const topicId =
      selectedTopicId || (data.topicId ? String(data.topicId) : undefined);
    updateDraft({
      teachingAssignmentId: assignmentId,
      title: data.title,
      description: data.description ?? "",
      type: data.type,
      dueAt: data.dueAt ?? "",
      topicId: topicId || undefined,
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
          topicId: draft.topicId ?? undefined,
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
     selectedTopicId,
     setSelectedTopicId,
     topics,
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
