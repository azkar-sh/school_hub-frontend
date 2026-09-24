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
  Calendar,
  Edit,
  GraduationCap,
  Layers,
} from "lucide-react";
import { useNewAssessmentForm } from "./hooks";
import { AssessmentDetailsStep } from "./_components/AssessmentDetailsStep";
import { QuestionCreatorCard } from "./_components/QuestionCreatorCard";
import { QuestionListCard } from "./_components/QuestionListCard";
import { useTranslations } from "next-intl";

export default function NewAssessmentPage() {
  const router = useRouter();
  const t = useTranslations("Assessments");
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
    handleMoveQuestionUp,
    handleMoveQuestionDown,
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

  const currentAssignment = React.useMemo(() => {
    const targetId = draft.teachingAssignmentId || selectedAssignmentId;
    return assignments.find((a) => a.id === targetId);
  }, [assignments, draft.teachingAssignmentId, selectedAssignmentId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={onFileSelected}
      />

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
              {t("createTitle")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("stepOf", {
                active: activeStep,
                label:
                  activeStep === 1
                    ? t("generalDetails")
                    : t("stepQuestionBank"),
              })}
            </p>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2">
          <Badge
            variant={activeStep === 1 ? "role" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveStep(1)}
          >
            1. {t("badgeDetails")}
          </Badge>
          <Badge
            variant={activeStep === 2 ? "role" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              if (draft.title) setActiveStep(2);
            }}
          >
            2. {t("badgeQuestions", { count: draft.questions.length })}
          </Badge>
        </div>
      </div>

      {/* Import / Error Alerts */}
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

      {/* Step 1: Details */}
      {activeStep === 1 && (
        <div className="space-y-6">
          {/* Quick Import Option in Step 1 */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Opsi Import Cepat Excel
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {downloadDisabledReason || "Download template lalu upload untuk membuat penilaian sekaligus."}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                disabled={!canDownloadTemplate || isDownloading || isImporting}
                isLoading={isDownloading}
                title={downloadDisabledReason ?? ""}
                className="text-xs rounded-xl"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {t("downloadTemplate")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting || isDownloading}
                isLoading={isImporting}
                className="text-xs rounded-xl"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                {t("importQuestions")}
              </Button>
            </div>
          </div>

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
        </div>
      )}

      {/* Step 2: Questions & Bank */}
      {activeStep === 2 && (
        <div className="space-y-6">
          {/* Persistent Context Summary Banner */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="role" className="font-semibold text-xs">
                  {draft.type === "QUIZ"
                    ? "Kuis"
                    : draft.type === "EXAM"
                      ? "Ujian"
                      : "Tugas"}
                </Badge>
                {currentAssignment?.subject?.name && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {currentAssignment.subject.name}
                  </Badge>
                )}
                {currentAssignment?.class?.name && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {currentAssignment.class.name}
                  </Badge>
                )}
                {draft.dueAt && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Tenggat: {draft.dueAt}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-foreground truncate">
                {draft.title || "Penilaian Tanpa Judul"}
              </h2>

              {draft.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {draft.description}
                </p>
              )}
            </div>

            {/* Step 2 Consolidated Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveStep(1)}
                className="rounded-xl text-xs"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Ubah Detail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                disabled={!canDownloadTemplate || isDownloading}
                isLoading={isDownloading}
                className="rounded-xl text-xs"
                title={downloadDisabledReason ?? ""}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {t("downloadTemplate")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                isLoading={isImporting}
                className="rounded-xl text-xs"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                {t("importXlsx")}
              </Button>
            </div>
          </div>

          {/* Question Creator Form */}
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

          {/* Question List Card with Reordering & Scale Tracker */}
          <QuestionListCard
            questions={draft.questions}
            onRemoveQuestion={handleRemoveQuestion}
            onEditQuestion={handleStartEdit}
            onMoveQuestionUp={handleMoveQuestionUp}
            onMoveQuestionDown={handleMoveQuestionDown}
            onPublish={handleFinalPublish}
            isSubmitting={isSubmitting}
            editingIndex={editingIndex}
          />
        </div>
      )}
    </div>
  );
}
