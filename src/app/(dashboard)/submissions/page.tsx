"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { X } from "lucide-react";
import { useSubmissionsPage } from "./hooks";
import { SubmissionLookupBar } from "./_components/SubmissionLookupBar";
import { SubmissionDetailCard } from "./_components/SubmissionDetailCard";
import { SubmissionsTableCard } from "./_components/SubmissionsTableCard";

export default function SubmissionsPage() {
  const {
    currentRole,
    isDemoMode,
    pageTitle,
    pageDescription,
    searchSubId,
    setSearchSubId,
    isLoadingLive,
    handleLookupSubmission,
    feedbackMsg,
    setFeedbackMsg,
    activeSubmissionDetail,
    gradeAnswerId,
    gradePoints,
    setGradePoints,
    startGradingAnswer,
    cancelGradingAnswer,
    handleGradeSubmission,
    displaySubmissions,
    isLoadingSubmissions,
  } = useSubmissionsPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Submission ID Lookup bar for real users */}
      {!isDemoMode && (
        <SubmissionLookupBar
          searchSubId={searchSubId}
          onChangeSearchSubId={setSearchSubId}
          onSubmit={handleLookupSubmission}
          isLoading={isLoadingLive}
        />
      )}

      {/* Inspected Submission Detail View */}
      {activeSubmissionDetail && (
        <SubmissionDetailCard
          submission={activeSubmissionDetail}
          currentRole={currentRole}
          gradeAnswerId={gradeAnswerId}
          gradePoints={gradePoints}
          onChangeGradePoints={setGradePoints}
          onStartGrading={startGradingAnswer}
          onCancelGrading={cancelGradingAnswer}
          onSubmitGrade={handleGradeSubmission}
        />
      )}

      {/* Submissions List Card */}
      <SubmissionsTableCard
        currentRole={currentRole}
        submissions={displaySubmissions}
        isLoading={isLoadingSubmissions}
      />
    </div>
  );
}
