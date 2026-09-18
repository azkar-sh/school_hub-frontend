"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNewAssessmentForm } from "./hooks";
import { AssessmentDetailsStep } from "./_components/AssessmentDetailsStep";
import { QuestionCreatorCard } from "./_components/QuestionCreatorCard";
import { QuestionListCard } from "./_components/QuestionListCard";

export default function NewAssessmentPage() {
  const router = useRouter();
  const {
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
  } = useNewAssessmentForm();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Create Assessment
            </h1>
            <p className="text-xs text-muted-foreground">
              Step {activeStep} of 2:{" "}
              {activeStep === 1 ? "General Details" : "Question Bank"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={activeStep === 1 ? "role" : "outline"}>
            1. Details
          </Badge>
          <Badge variant={activeStep === 2 ? "role" : "outline"}>
            2. Questions ({draft.questions.length})
          </Badge>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {activeStep === 1 && (
        <AssessmentDetailsStep
          methods={methods}
          isDemoMode={isDemoMode}
          assignments={assignments}
          selectedAssignmentId={selectedAssignmentId}
          onSelectAssignment={setSelectedAssignmentId}
          onSubmit={handleStep1Submit}
          topics={topics}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
        />
      )}

      {activeStep === 2 && (
        <div className="space-y-6">
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
          />

          <QuestionListCard
            questions={draft.questions}
            onRemoveQuestion={removeQuestionFromDraft}
            onPublish={handleFinalPublish}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
