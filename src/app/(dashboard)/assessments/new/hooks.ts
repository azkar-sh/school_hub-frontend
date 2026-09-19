import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { assessmentSchema } from "@/lib/schemas";
import {
  buildAssessmentTemplate,
  parseAssessmentWorkbook,
} from "@/lib/assessment-xlsx";
import { useAssessmentStore } from "@/stores/use-assessment-store";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  assessmentsApi,
  teachingAssignmentsApi,
  subjectsApi,
} from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import {
  CreateAssessmentDto,
  TeachingAssignment,
  SubTopic,
  Topic,
} from "@/types";

/**
 * Form data for step 1 (assessment details).
 * Matches backend CreateAssessmentDto minus nested questions.
 */
export type AssessmentFormData = Pick<
  CreateAssessmentDto,
  | "teachingAssignmentId"
  | "title"
  | "description"
  | "type"
  | "dueAt"
  | "topicId"
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
    setQuestions,
    removeQuestionFromDraft,
    editQuestionInDraft,
    resetDraft,
  } = useAssessmentStore();

  const [activeStep, setActiveStep] = React.useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [importInfo, setImportInfo] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [assignments, setAssignments] = React.useState<TeachingAssignment[]>(
    [],
  );
  const [selectedAssignmentId, setSelectedAssignmentId] =
    React.useState<string>(draft.teachingAssignmentId || "");
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(
    draft.topicId ?? null,
  );
  const [subTopics, setSubTopics] = React.useState<SubTopic[]>([]);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [selectedSubTopicId, setSelectedSubTopicId] = React.useState<string>(
    draft.questions?.[0]?.subTopicId || "",
  );

  const [qText, setQText] = React.useState("");
  const [qType, setQType] = React.useState<
    "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"
  >("MCQ");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
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
    mode: "onChange",
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

  const watchedTitle = methods.watch("title");
  const canDownloadTemplate = React.useMemo(() => {
    const titleOk = (watchedTitle?.trim().length ?? 0) >= 3;
    if (!titleOk) return false;
    if (isDemoMode) return true;
    if (!selectedAssignmentId) return false;
    if (subTopics.length === 0) return false;
    return true;
  }, [watchedTitle, isDemoMode, selectedAssignmentId, subTopics.length]);

  const downloadDisabledReason = React.useMemo(() => {
    if (canDownloadTemplate) return null;
    if ((watchedTitle?.trim().length ?? 0) < 3)
      return "Enter title (≥3 chars) to enable download"; // i18n: TODO
    if (!isDemoMode && !selectedAssignmentId)
      return "Select teaching assignment / class first"; // i18n: TODO
    if (!isDemoMode && subTopics.length === 0)
      return "No sub-topics for this subject — create sub-topics first"; // i18n: TODO
    return null;
  }, [
    canDownloadTemplate,
    watchedTitle,
    isDemoMode,
    selectedAssignmentId,
    subTopics.length,
  ]);

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
    setEditingIndex(null);
  };

  // Hydrate creator form with an existing draft question so the teacher
  // can edit text/type/points/options and save back to the same slot.
  const handleStartEdit = (index: number) => {
    const q = draft.questions[index];
    if (!q) return;
    setEditingIndex(index);
    setQText(q.question);
    setQType(q.type);
    setQPoints(q.points);
    setOptions(
      q.options.length > 0
        ? q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect }))
        : q.type === "SHORT_ANSWER"
          ? []
          : q.type === "TRUE_FALSE"
            ? TRUE_FALSE_OPTIONS
            : DEFAULT_OPTIONS,
    );
    setSelectedSubTopicId(q.subTopicId);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    if (!qText.trim()) return;
    if (!isDemoMode && !selectedSubTopicId) {
      setErrorMsg("Select a sub-topic before saving the question."); // i18n: TODO
      return;
    }
    const subTopicId = selectedSubTopicId || "demo-subtopic-id";
    editQuestionInDraft(editingIndex, {
      subTopicId,
      question: qText,
      type: qType,
      points: Number(qPoints) || 10,
      options: qType === "SHORT_ANSWER" ? [] : options,
    });
    resetQuestionCreator();
  };

  const handleCancelEdit = () => {
    resetQuestionCreator();
  };

  const handleRemoveQuestion = (index: number) => {
    if (editingIndex !== null) {
      if (index === editingIndex) {
        resetQuestionCreator();
      } else if (index < editingIndex) {
        setEditingIndex((prev) => (prev !== null ? prev - 1 : null));
      }
    }
    removeQuestionFromDraft(index);
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    // Live mode requires a real subTopicId (backend FK, no demo fallback).
    if (!isDemoMode && !selectedSubTopicId) {
      setErrorMsg("Select a sub-topic before adding a question."); // i18n: TODO
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

  const handleDownloadTemplate = async () => {
    try {
      setErrorMsg(null);
      setIsDownloading(true);
      const vals = methods.getValues();
      const liveDraft = {
        teachingAssignmentId:
          selectedAssignmentId ||
          vals.teachingAssignmentId ||
          draft.teachingAssignmentId ||
          "",
        title: vals.title || draft.title || "",
        description: vals.description ?? draft.description ?? "",
        type:
          (vals.type as "QUIZ" | "EXAM" | "ASSIGNMENT") || draft.type || "QUIZ",
        dueAt: vals.dueAt || draft.dueAt || "",
        topicId:
          selectedTopicId ??
          (vals.topicId ? String(vals.topicId) : undefined) ??
          draft.topicId,
      };
      if (!liveDraft.teachingAssignmentId && !isDemoMode) {
        setErrorMsg(
          "Select a teaching assignment before downloading template.", // i18n: TODO
        );
        return;
      }
      if (subTopics.length === 0 && !isDemoMode) {
        setErrorMsg(
          "No sub-topics found for this assignment/subject. Create sub-topics first.", // i18n: TODO
        );
        return;
      }
      const blob = await buildAssessmentTemplate({
        draft: liveDraft,
        subTopics,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessment-template-${(liveDraft.title || "untitled").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErrorMsg(getErrorMessage(e, "Failed to generate template")); // i18n: TODO
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      setErrorMsg(null);
      setIsImporting(true);
      const res = await parseAssessmentWorkbook(file);
      if (res.draft.teachingAssignmentId)
        setSelectedAssignmentId(res.draft.teachingAssignmentId);
      if (res.draft.topicId !== undefined)
        setSelectedTopicId(res.draft.topicId || null);
      updateDraft({
        teachingAssignmentId:
          res.draft.teachingAssignmentId || draft.teachingAssignmentId,
        title: res.draft.title || draft.title,
        description: res.draft.description ?? draft.description,
        type: res.draft.type || draft.type,
        dueAt: res.draft.dueAt ?? draft.dueAt,
        topicId: res.draft.topicId ?? draft.topicId,
      });
      if (res.draft.title) methods.setValue("title", res.draft.title);
      if (res.draft.type) methods.setValue("type", res.draft.type);
      if (res.draft.dueAt !== undefined)
        methods.setValue("dueAt", res.draft.dueAt);
      if (res.draft.description !== undefined)
        methods.setValue("description", res.draft.description);
      if (res.questions.length > 0) {
        const merged = [
          ...draft.questions,
          ...res.questions.map((q, i) => ({
            ...q,
            order: draft.questions.length + i,
          })),
        ];
        setQuestions(merged);
      }
      if (res.errors.length > 0) {
        setErrorMsg(
          res.errors.slice(0, 4).join(" | ") +
            (res.errors.length > 4 ? ` (+${res.errors.length - 4} more)` : ""),
        );
      }
      const msg = `Imported ${res.questions.length} question(s)${res.draft.title ? ` — "${res.draft.title}"` : ""}. Review below before publish.`; // i18n: TODO
      setImportInfo(msg);
      setActiveStep(2);
    } catch (e) {
      setErrorMsg(getErrorMessage(e, "Failed to parse xlsx")); // i18n: TODO
    } finally {
      setIsImporting(false);
    }
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
          throw new Error("Select a teaching assignment first."); // i18n: TODO
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
      setErrorMsg(getErrorMessage(error, "Failed to publish assessment")); // i18n: TODO
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    isDemoMode,
    activeStep,
    setActiveStep,
    isSubmitting,
    isDownloading,
    isImporting,
    importInfo,
    errorMsg,
    canDownloadTemplate,
    downloadDisabledReason,
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
    handleDownloadTemplate,
    handleImportFile,
    handleFinalPublish,
    removeQuestionFromDraft,
    handleRemoveQuestion,
    editQuestionInDraft,
    editingIndex,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
  };
}
