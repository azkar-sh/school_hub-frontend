"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useSubmissionDetailPage } from "./hooks";
import { SubmissionDetailCard } from "../_components/SubmissionDetailCard";

export default function SubmissionDetailPage() {
  const params = useParams();
  const submissionId = params?.id as string;

  const {
    currentRole,
    isDemoMode,
    submission,
    isLoading,
    feedbackMsg,
    setFeedbackMsg,
    gradeAnswerId,
    gradePoints,
    setGradePoints,
    startGradingAnswer,
    cancelGradingAnswer,
    handleGradeSubmission,
    handleAutoGradeSubmission,
    autoGrading,
  } = useSubmissionDetailPage(submissionId);

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      <Link
        href="/submissions"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading submission…</span>
        </div>
      )}

      {!isDemoMode && !isLoading && !submission && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Submission not found or you are not authorized to view it.
        </div>
      )}

      {submission && (!isLoading || isDemoMode) && (
        <SubmissionDetailCard
          submission={submission}
          currentRole={currentRole}
          gradeAnswerId={gradeAnswerId}
          gradePoints={gradePoints}
          onChangeGradePoints={setGradePoints}
          onStartGrading={startGradingAnswer}
          onCancelGrading={cancelGradingAnswer}
          onSubmitGrade={handleGradeSubmission}
          onAutoGrade={handleAutoGradeSubmission}
          autoGrading={autoGrading}
        />
      )}
    </div>
  );
}
