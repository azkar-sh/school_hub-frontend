"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { CheckCircle2, X } from "lucide-react";
import { useSubjectsPage } from "./hooks";
import { SubjectsHeader } from "./_components/SubjectsHeader";
import { MockSubjectsList } from "./_components/MockSubjectsList";
import { SubjectsList } from "./_components/SubjectsList";
import { AddSubjectModal } from "./_components/AddSubjectModal";
import { AddTopicModal } from "./_components/AddTopicModal";
import { AddSubTopicModal } from "./_components/AddSubTopicModal";

export default function SubjectsPage() {
  const {
    isDemoMode,
    currentRole,
    isTeacher,
    canEditCurriculum,
    canAddSubject,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    feedbackMsg,
    setFeedbackMsg,
    showAddSubjectModal,
    setShowAddSubjectModal,
    newSubjectName,
    setNewSubjectName,
    newSubjectCode,
    setNewSubjectCode,
    activeTopicSubjectId,
    setActiveTopicSubjectId,
    newTopicName,
    setNewTopicName,
    newTopicDesc,
    setNewTopicDesc,
    activeSubTopicTopicId,
    setActiveSubTopicTopicId,
    newSubTopicName,
    setNewSubTopicName,
    newSubTopicDesc,
    setNewSubTopicDesc,
    isLoading,
    subjectsList,
    assignedSubjects,
    otherSubjects,
    subjectClassesMap,
    subjectTeachersMap,
    displaySubjects,
    handleCreateSubject,
    handleCreateTopic,
    handleCreateSubTopic,
  } = useSubjectsPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <SubjectsHeader
        currentRole={currentRole}
        canEditCurriculum={canEditCurriculum}
        canAddSubject={canAddSubject}
        isDemoMode={isDemoMode}
        schools={schools}
        selectedSchoolId={selectedSchoolId}
        onSelectSchool={setSelectedSchoolId}
        onAddSubject={() => setShowAddSubjectModal(true)}
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
      {isDemoMode && <MockSubjectsList subjects={displaySubjects} />}

      {/* Real Backend Data Display */}
      {!isDemoMode && (
        <SubjectsList
          isLoading={isLoading}
          subjects={subjectsList}
          canEditCurriculum={canEditCurriculum}
          onAddTopic={setActiveTopicSubjectId}
          onAddSubTopic={setActiveSubTopicTopicId}
          isTeacher={isTeacher}
          assignedSubjects={assignedSubjects}
          otherSubjects={otherSubjects}
          subjectClassesMap={subjectClassesMap}
          subjectTeachersMap={subjectTeachersMap}
        />
      )}

      {showAddSubjectModal && (
        <AddSubjectModal
          name={newSubjectName}
          onChangeName={setNewSubjectName}
          code={newSubjectCode}
          onChangeCode={setNewSubjectCode}
          onClose={() => setShowAddSubjectModal(false)}
          onSubmit={handleCreateSubject}
        />
      )}

      {activeTopicSubjectId && (
        <AddTopicModal
          name={newTopicName}
          onChangeName={setNewTopicName}
          description={newTopicDesc}
          onChangeDescription={setNewTopicDesc}
          onClose={() => setActiveTopicSubjectId(null)}
          onSubmit={handleCreateTopic}
        />
      )}

      {activeSubTopicTopicId && (
        <AddSubTopicModal
          name={newSubTopicName}
          onChangeName={setNewSubTopicName}
          description={newSubTopicDesc}
          onChangeDescription={setNewSubTopicDesc}
          onClose={() => setActiveSubTopicTopicId(null)}
          onSubmit={handleCreateSubTopic}
        />
      )}
    </div>
  );
}
