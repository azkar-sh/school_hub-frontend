"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useAdminPage } from "./hooks";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminTabs } from "./_components/AdminTabs";
import { FeedbackBanner } from "./_components/FeedbackBanner";
import { SchoolsTab } from "./_components/SchoolsTab";
import { AcademicYearsTab } from "./_components/AcademicYearsTab";
import { MembersTab } from "./_components/MembersTab";
import { ParentLinkTab } from "./_components/ParentLinkTab";

export default function AdminPage() {
  const {
    isDemoMode,
    activeTab,
    setActiveTab,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    feedback,
    schoolName,
    setSchoolName,
    ayName,
    setAyName,
    ayStartsAt,
    setAyStartsAt,
    ayEndsAt,
    setAyEndsAt,
    memberUserId,
    setMemberUserId,
    linkParentId,
    setLinkParentId,
    linkStudentId,
    setLinkStudentId,
    linkRelationship,
    setLinkRelationship,
    academicYears,
    isLoading,
    schoolMembers,
    usersList,
    handleCreateSchool,
    handleCreateAcademicYear,
    handleAddMember,
    handleLinkParentStudent,
  } = useAdminPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <AdminHeader />

      {feedback && <FeedbackBanner feedback={feedback} />}

      <AdminTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        schoolsCount={schools.length}
        academicYearsCount={academicYears.length}
      />

      {activeTab === "schools" && (
        <SchoolsTab
          schoolName={schoolName}
          onChangeSchoolName={setSchoolName}
          onCreateSchool={handleCreateSchool}
          isLoading={isLoading}
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onSelectSchool={setSelectedSchoolId}
        />
      )}

      {activeTab === "academicYears" && (
        <AcademicYearsTab
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onSelectSchool={setSelectedSchoolId}
          ayName={ayName}
          onChangeAyName={setAyName}
          ayStartsAt={ayStartsAt}
          onChangeAyStartsAt={setAyStartsAt}
          ayEndsAt={ayEndsAt}
          onChangeAyEndsAt={setAyEndsAt}
          onCreateAcademicYear={handleCreateAcademicYear}
          isLoading={isLoading}
          academicYears={academicYears}
        />
      )}

      {activeTab === "members" && (
        <MembersTab
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onSelectSchool={setSelectedSchoolId}
          usersList={usersList}
          memberUserId={memberUserId}
          onChangeMemberUserId={setMemberUserId}
          onAddMember={handleAddMember}
          isLoading={isLoading}
          schoolMembers={schoolMembers}
        />
      )}

      {activeTab === "parents" && (
        <ParentLinkTab
          usersList={usersList}
          linkParentId={linkParentId}
          onChangeLinkParentId={setLinkParentId}
          linkStudentId={linkStudentId}
          onChangeLinkStudentId={setLinkStudentId}
          linkRelationship={linkRelationship}
          onChangeLinkRelationship={setLinkRelationship}
          onSubmit={handleLinkParentStudent}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
