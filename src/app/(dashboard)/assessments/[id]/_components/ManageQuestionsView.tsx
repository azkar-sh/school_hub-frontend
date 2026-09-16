"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  HelpCircle,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useManageQuestions } from "../hooks";
import { QuestionCreatorCard } from "../../new/_components/QuestionCreatorCard";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Question } from "@/types";

interface ManageQuestionsViewProps {
  assessmentId: string;
  isDemoMode: boolean;
}

export function ManageQuestionsView({
  assessmentId,
  isDemoMode,
}: ManageQuestionsViewProps) {
  const router = useRouter();
  const {
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
  } = useManageQuestions({ assessmentId, isDemoMode });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading assessment details...</span>
      </div>
    );
  }

  const questions: Question[] = assessment?.questions ?? [];
  const subject = assessment?.teachingAssignment?.subject;
  const klass = assessment?.teachingAssignment?.class;
  const teacher = assessment?.teachingAssignment?.teacher;
  const due = assessment?.dueAt
    ? new Date(assessment.dueAt).toLocaleDateString()
    : "No due date";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/assessments")}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight truncate">
            {assessment?.title ?? "Manage Questions"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review and add questions to this assessment
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase">
          {assessment?.type ?? "QUIZ"}
        </Badge>
      </div>

      {/* Assessment meta */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {subject && (
            <span>
              <span className="font-semibold uppercase">Subject:</span>{" "}
              {subject.name}
            </span>
          )}
          {klass && (
            <span>
              <span className="font-semibold uppercase">Class:</span>{" "}
              {klass.name}
            </span>
          )}
          {teacher && (
            <span>
              <span className="font-semibold uppercase">Teacher:</span>{" "}
              {teacher.name}
            </span>
          )}
          <span>
            <span className="font-semibold uppercase">Due:</span> {due}
          </span>
          <span>
            <span className="font-semibold uppercase">Questions:</span>{" "}
            {questions.length}
          </span>
        </div>
      </Card>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Existing questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <span>Question Bank ({questions.length})</span>
          </CardTitle>
          <CardDescription>
            Questions currently attached to this assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No questions yet. Use the form below to add your first question.
            </div>
          ) : (
            questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-primary">
                      Q{idx + 1}.
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {q.type} ({q.points} pts)
                    </Badge>
                  </div>
                  {!isDemoMode && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditQuestion(q)}
                        disabled={isDeletingQuestion || isSavingQuestion}
                        className="h-7 px-2 text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this question? This cannot be undone.")) {
                            handleDeleteQuestion(q.id);
                          }
                        }}
                        disabled={isDeletingQuestion || isSavingQuestion}
                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm">{q.question}</p>
                {(q.type === "MCQ" || q.type === "TRUE_FALSE") &&
                  q.options &&
                  q.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                      {q.options.map((o, i) => (
                        <span
                          key={i}
                          className={
                            o.isCorrect
                              ? "text-success font-bold"
                              : ""
                          }
                        >
                          {o.isCorrect ? "✓ " : ""}
                          {o.text}
                        </span>
                      ))}
                    </div>
                  )}
                {q.type === "SHORT_ANSWER" && (
                  <div className="text-xs text-muted-foreground italic flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Requires manual grading
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add/Edit question form — reuses the same creator used during creation */}
      <QuestionCreatorCard
        isDemoMode={isDemoMode}
        subTopics={subTopics}
        selectedSubTopicId={selectedSubTopicId}
        onSelectSubTopic={setSelectedSubTopicId}
        qText={qText}
        onChangeQText={setQText}
        qType={qType}
        onChangeQType={handleChangeQType}
        qPoints={qPoints}
        onChangeQPoints={setQPoints}
        options={options}
        onChangeOptions={setOptions}
        onAddQuestion={handleAddQuestion}
        editMode={!!editingQuestionId}
        onSaveQuestion={handleSaveQuestion}
        onCancelEdit={cancelEdit}
        isSaving={isSavingQuestion}
      />

      {isAddingQuestion && (
        <div className="flex items-center justify-center py-4 text-muted-foreground gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding question...</span>
        </div>
      )}
      {isDeletingQuestion && (
        <div className="flex items-center justify-center py-4 text-muted-foreground gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Deleting question...</span>
        </div>
      )}
    </div>
  );
}
