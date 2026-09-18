"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertCircle,
  Download,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useNewAssessmentForm } from "./hooks";
import { AssessmentDetailsStep } from "./_components/AssessmentDetailsStep";
import { QuestionCreatorCard } from "./_components/QuestionCreatorCard";
import { QuestionListCard } from "./_components/QuestionListCard";

export default function NewAssessmentPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {
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
    handleRemoveQuestion,
    editingIndex,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
  } = useNewAssessmentForm();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleImportFile(f);
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={onFileSelected}
      />

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

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          disabled={!canDownloadTemplate || isDownloading || isImporting}
          isLoading={isDownloading}
          title={downloadDisabledReason ?? ""}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting || isDownloading}
          isLoading={isImporting}
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Questions (.xlsx)
        </Button>
        <span className="text-[11px] text-muted-foreground">
          {downloadDisabledReason
            ? downloadDisabledReason
            : "Download fills template with current assignment & sub-topics. Import is self-contained — assignment/topic/title auto-loaded from xlsx."}
        </span>
      </div>

      {importInfo && (
        <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-xs text-success font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importInfo}</span>
        </div>
      )}

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
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setActiveStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                disabled={!canDownloadTemplate || isDownloading}
                isLoading={isDownloading}
                title={downloadDisabledReason ?? ""}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                isLoading={isImporting}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import xlsx
              </Button>
            </div>
          </div>

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
            editMode={editingIndex !== null}
            onSaveQuestion={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />

          <QuestionListCard
            questions={draft.questions}
            onRemoveQuestion={handleRemoveQuestion}
            onEditQuestion={handleStartEdit}
            onPublish={handleFinalPublish}
            isSubmitting={isSubmitting}
            editingIndex={editingIndex}
          />
        </div>
      )}
    </div>
  );
}
