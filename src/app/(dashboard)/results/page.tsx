"use client";

import { useResultsPage } from "./hooks";
import { TeacherResultsView } from "./_components/TeacherResultsView";
import { StudentResultsView } from "./_components/StudentResultsView";
import { ParentResultsView } from "./_components/ParentResultsView";

export default function ResultsPage() {
  const {
    isDemoMode,
    currentRole,
    isLoading,
    studentSubjects,
    teacherSubjects,
    parentChildrenResults,
  } = useResultsPage();

  if (currentRole === "TEACHER") {
    return (
      <TeacherResultsView
        isDemoMode={isDemoMode}
        isLoading={isLoading}
        teacherSubjects={teacherSubjects}
      />
    );
  }

  if (currentRole === "STUDENT") {
    return (
      <StudentResultsView
        isDemoMode={isDemoMode}
        isLoading={isLoading}
        studentSubjects={studentSubjects}
      />
    );
  }

  return (
    <ParentResultsView
      isDemoMode={isDemoMode}
      isLoading={isLoading}
      parentChildrenResults={parentChildrenResults}
    />
  );
}
