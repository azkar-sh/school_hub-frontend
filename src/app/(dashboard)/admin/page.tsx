"use client";

import * as React from "react";
import { useAdminPage } from "./hooks";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminTabs } from "./_components/AdminTabs";
import { InstitutionTab } from "./_components/InstitutionTab";
import { GuardianshipTab } from "./_components/GuardianshipTab";
import { OperationsTab } from "./_components/OperationsTab";
import { CreateSchoolModal } from "./_components/CreateSchoolModal";
import { LinkGuardianModal } from "./_components/LinkGuardianModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const {
    user,
    activeTab,
    setActiveTab,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    schoolDetails,
    classesList,
    parentStudentOverview,
    parentStudentLinks,
    filteredLinks,
    isLoadingLinks,
    isLoadingOverview,
    parentsList,
    studentsList,
    searchGuardians,
    setSearchGuardians,
    selectedClassFilter,
    setSelectedClassFilter,
    relationshipFilter,
    setRelationshipFilter,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    showCreateSchoolModal,
    setShowCreateSchoolModal,
    schoolName,
    setSchoolName,
    showLinkModal,
    setShowLinkModal,
    linkParentId,
    setLinkParentId,
    linkStudentId,
    setLinkStudentId,
    linkRelationship,
    setLinkRelationship,
    feedback,
    isSubmitting,
    handleCreateSchool,
    handleLinkParentStudent,
    handleUnlinkParentStudent,
    handleOpenLinkForStudent,
  } = useAdminPage();

  const activeSchool =
    schoolDetails ??
    (schools.find((s) => s.id === selectedSchoolId) as any);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Header */}
      <AdminHeader
        activeTab={activeTab}
        onOpenCreateSchool={() => setShowCreateSchoolModal(true)}
        onOpenLinkGuardian={() => {
          setLinkStudentId("");
          setShowLinkModal(true);
        }}
      />

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold animate-in fade-in duration-200 ${
            feedback.type === "error"
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {feedback.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Modern Navigation Tabs */}
      <AdminTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        campusesCount={schools.length}
        guardianshipsCount={parentStudentLinks.length}
      />

      {/* Active Tab View */}
      {activeTab === "institution" && activeSchool && (
        <InstitutionTab
          school={activeSchool}
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onSelectSchool={setSelectedSchoolId}
          onOpenCreateSchool={() => setShowCreateSchoolModal(true)}
          currentUser={user}
        />
      )}

      {activeTab === "guardianship" && (
        <GuardianshipTab
          links={filteredLinks}
          totalParents={parentsList.length}
          totalStudents={studentsList.length}
          search={searchGuardians}
          onSearchChange={setSearchGuardians}
          onOpenLinkModal={() => {
            setLinkStudentId("");
            setShowLinkModal(true);
          }}
          onUnlink={handleUnlinkParentStudent}
          isLoading={isLoadingLinks || isLoadingOverview}
          overview={parentStudentOverview}
          classesList={classesList}
          selectedClassFilter={selectedClassFilter}
          onClassFilterChange={setSelectedClassFilter}
          relationshipFilter={relationshipFilter}
          onRelationshipFilterChange={setRelationshipFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onQuickLinkStudent={handleOpenLinkForStudent}
        />
      )}

      {activeTab === "operations" && (
        <OperationsTab
          memberCount={activeSchool?._count?.members ?? 39}
          classCount={activeSchool?._count?.classes ?? 2}
          subjectCount={activeSchool?.subjects?.length ?? 6}
          activeAcademicYear={
            activeSchool?.academicYears?.find((ay: any) => ay.isActive)?.name ??
            "2026/2027"
          }
        />
      )}

      {/* Register Campus Modal */}
      {showCreateSchoolModal && (
        <CreateSchoolModal
          schoolName={schoolName}
          onChangeSchoolName={setSchoolName}
          onSubmit={handleCreateSchool}
          onClose={() => setShowCreateSchoolModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Link Guardian Modal */}
      {showLinkModal && (
        <LinkGuardianModal
          parents={parentsList}
          students={studentsList}
          classes={classesList}
          linkParentId={linkParentId}
          onChangeLinkParentId={setLinkParentId}
          linkStudentId={linkStudentId}
          onChangeLinkStudentId={setLinkStudentId}
          linkRelationship={linkRelationship}
          onChangeLinkRelationship={setLinkRelationship}
          onSubmit={handleLinkParentStudent}
          onClose={() => {
            setShowLinkModal(false);
            setLinkStudentId("");
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
