"use client";

import { useResultsPage } from "./hooks";
import { TeacherResultsView } from "./_components/TeacherResultsView";
import { StudentResultsView } from "./_components/StudentResultsView";
import { ParentResultsView } from "./_components/ParentResultsView";

export default function ResultsPage() {
  const { isDemoMode, currentRole, liveAssessments, isLoading } =
    useResultsPage();

  if (currentRole === "TEACHER") {
    return (
      <TeacherResultsView
        isDemoMode={isDemoMode}
        isLoading={isLoading}
        liveAssessments={liveAssessments}
      />
    );
  }

  if (currentRole === "STUDENT") {
    return (
      <StudentResultsView
        isDemoMode={isDemoMode}
        isLoading={isLoading}
        liveAssessments={liveAssessments}
      />
    );
  }

  return <ParentResultsView isDemoMode={isDemoMode} />;
}
