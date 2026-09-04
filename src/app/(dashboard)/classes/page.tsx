"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { CheckCircle2, X } from "lucide-react";
import { useClassesPage } from "./hooks";
import { ClassesHeader } from "./_components/ClassesHeader";
import { MockClassesGrid } from "./_components/MockClassesGrid";
import { ClassesGrid } from "./_components/ClassesGrid";
import { CreateClassModal } from "./_components/CreateClassModal";
import { EnrollStudentModal } from "./_components/EnrollStudentModal";
import { AssignHomeroomModal } from "./_components/AssignHomeroomModal";
import { ViewStudentsModal } from "./_components/ViewStudentsModal";

export default function ClassesPage() {
  const {
    isDemoMode,
    currentRole,
    currentUserId,
    canManageClasses,
    academicYears,
    selectedAyId,
    setSelectedAyId,
    usersList,
    feedbackMsg,
    setFeedbackMsg,
    showCreateClassModal,
    setShowCreateClassModal,
    classNameInput,
    setClassNameInput,
    classGradeInput,
    setClassGradeInput,
    activeEnrollClassId,
    setActiveEnrollClassId,
    enrollStudentId,
    setEnrollStudentId,
    activeHomeroomClassId,
    setActiveHomeroomClassId,
    homeroomTeacherId,
    setHomeroomTeacherId,
    activeViewClassId,
    setActiveViewClassId,
    activeViewClassName,
    viewStudentsList,
    isLoadingViewStudents,
    isLoading,
    classesList,
    mockClasses,
    isLoadingRegisteredStudents,
    registeredStudentsList,
    handleCreateClass,
    handleEnrollStudent,
    handleAssignHomeroom,
  } = useClassesPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <ClassesHeader
        currentRole={currentRole}
        canManageClasses={canManageClasses}
        onCreateClass={() => setShowCreateClassModal(true)}
      />

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Demo Mode Mock Display */}
      {isDemoMode && (
        <MockClassesGrid classes={mockClasses} currentRole={currentRole} />
      )}

      {/* Real Backend Data Display */}
      {!isDemoMode && (
        <ClassesGrid
          isLoading={isLoading}
          classes={classesList}
          selectedAyId={selectedAyId}
          currentRole={currentRole}
          currentUserId={currentUserId}
          canManageClasses={canManageClasses}
          onViewStudents={setActiveViewClassId}
          onEnrollStudent={setActiveEnrollClassId}
          onAssignHomeroom={setActiveHomeroomClassId}
        />
      )}

      {showCreateClassModal && (
        <CreateClassModal
          name={classNameInput}
          onChangeName={setClassNameInput}
          grade={classGradeInput}
          onChangeGrade={setClassGradeInput}
          academicYears={academicYears}
          selectedAyId={selectedAyId}
          onChangeAyId={setSelectedAyId}
          onClose={() => setShowCreateClassModal(false)}
          onSubmit={handleCreateClass}
        />
      )}

      {activeEnrollClassId && (
        <EnrollStudentModal
          usersList={usersList}
          isLoadingRegisteredStudents={isLoadingRegisteredStudents}
          registeredStudentsList={registeredStudentsList}
          studentId={enrollStudentId}
          onChangeStudentId={setEnrollStudentId}
          onClose={() => setActiveEnrollClassId(null)}
          onSubmit={handleEnrollStudent}
        />
      )}

      {activeHomeroomClassId && (
        <AssignHomeroomModal
          usersList={usersList}
          teacherId={homeroomTeacherId}
          onChangeTeacherId={setHomeroomTeacherId}
          onClose={() => setActiveHomeroomClassId(null)}
          onSubmit={handleAssignHomeroom}
        />
      )}

      {activeViewClassId && (
        <ViewStudentsModal
          className={activeViewClassName}
          isLoading={isLoadingViewStudents}
          students={viewStudentsList}
          onClose={() => setActiveViewClassId(null)}
        />
      )}
    </div>
  );
}
