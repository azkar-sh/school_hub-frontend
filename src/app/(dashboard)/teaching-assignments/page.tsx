"use client";

import * as React from "react";
import { useTeachingAssignmentsPage } from "./hooks";
import { TeachingAssignmentsHeader } from "./_components/TeachingAssignmentsHeader";
import { TeachingAssignmentsGrid } from "./_components/TeachingAssignmentsGrid";
import { AssignTeacherModal } from "./_components/AssignTeacherModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function TeachingAssignmentsPage() {
  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    search,
    setSearch,
    filterSubjectId,
    setFilterSubjectId,
    filterClassId,
    setFilterClassId,
    showAssignModal,
    setShowAssignModal,
    teacherId,
    setTeacherId,
    subjectId,
    setSubjectId,
    classId,
    setClassId,
    academicYearId,
    setAcademicYearId,
    isSubmitting,
    feedbackMsg,
    isLoading,
    filteredAssignments,
    teachersList,
    subjectsList,
    classesList,
    academicYearsList,
    handleAssignTeacher,
  } = useTeachingAssignmentsPage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with School Selector & Assign Button */}
      <TeachingAssignmentsHeader
        schools={schools}
        selectedSchoolId={selectedSchoolId}
        onSelectSchool={setSelectedSchoolId}
        onAssignTeacher={() => setShowAssignModal(true)}
      />

      {/* Feedback Message */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold animate-in fade-in duration-200 ${
            feedbackMsg.toLowerCase().includes("failed") ||
            feedbackMsg.toLowerCase().includes("error")
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {feedbackMsg.toLowerCase().includes("failed") ||
          feedbackMsg.toLowerCase().includes("error") ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Grid / List of Teaching Assignments */}
      <TeachingAssignmentsGrid
        isLoading={isLoading}
        assignments={filteredAssignments}
        subjects={subjectsList}
        classes={classesList}
        search={search}
        onSearchChange={setSearch}
        filterSubjectId={filterSubjectId}
        onFilterSubjectChange={setFilterSubjectId}
        filterClassId={filterClassId}
        onFilterClassChange={setFilterClassId}
        onAssignClick={() => setShowAssignModal(true)}
      />

      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <AssignTeacherModal
          teachers={teachersList}
          subjects={subjectsList}
          classes={classesList}
          academicYears={academicYearsList}
          teacherId={teacherId}
          onChangeTeacherId={setTeacherId}
          subjectId={subjectId}
          onChangeSubjectId={setSubjectId}
          classId={classId}
          onChangeClassId={setClassId}
          academicYearId={academicYearId}
          onChangeAcademicYearId={setAcademicYearId}
          isSubmitting={isSubmitting}
          onClose={() => setShowAssignModal(false)}
          onSubmit={handleAssignTeacher}
        />
      )}
    </div>
  );
}
