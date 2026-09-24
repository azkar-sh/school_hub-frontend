"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useDashboardPage } from "./hooks";
import { WelcomeBanner } from "./_components/WelcomeBanner";
import { AdminStatsGrid } from "./_components/AdminStatsGrid";
import { TeacherStatsGrid } from "./_components/TeacherStatsGrid";
import { StudentStatsGrid } from "./_components/StudentStatsGrid";
import { ParentStatsGrid } from "./_components/ParentStatsGrid";
import { AdminDashboardContent } from "./_components/AdminDashboardContent";
import { TeacherDashboardContent } from "./_components/TeacherDashboardContent";
import { StudentDashboardContent } from "./_components/StudentDashboardContent";
import { ParentDashboardContent } from "./_components/ParentDashboardContent";

export default function DashboardPage() {
  const {
    user,
    isDemoMode,
    currentRole,
    liveAssessments,
    isLoadingLive,
    liveFetchError,
    displayAssessments,
    schoolAdminOverview,
    schoolAdminAcademicYear,
    schoolAdminActivity,
    adminIsLoading,
    teacherClasses,
    teacherPendingResults,
    teacherClassAverage,
    teacherIsLoading,
    submissions,
    studentClass,
    studentQuizzesTaken,
    studentAverageScore,
    studentPendingDue,
    studentRecentResults,
    studentIsLoading,
    parentChildren,
    parentAvgScore,
    parentCompletedCount,
    parentRecentResults,
    parentFirstChildGrade,
    parentIsLoading,
  } = useDashboardPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <WelcomeBanner
        currentRole={currentRole}
        isDemoMode={isDemoMode}
        userName={user?.name}
      />

      {/* Metric Stats Grid — 2 columns on mobile for compactness, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {currentRole === "SCHOOL_ADMIN" && (
          <AdminStatsGrid
            overview={schoolAdminOverview}
            isLoading={adminIsLoading}
          />
        )}
        {currentRole === "TEACHER" && (
          <TeacherStatsGrid
            isDemoMode={isDemoMode}
            teacherClasses={teacherClasses}
            liveAssessmentsCount={liveAssessments.length}
            pendingResults={teacherPendingResults}
            classAverage={teacherClassAverage}
            isLoading={teacherIsLoading}
          />
        )}
        {currentRole === "STUDENT" && (
          <StudentStatsGrid
            isDemoMode={isDemoMode}
            quizzesTaken={studentQuizzesTaken}
            averageScore={studentAverageScore}
            pendingDue={studentPendingDue}
            isLoading={studentIsLoading}
          />
        )}
        {currentRole === "PARENT" && (
          <ParentStatsGrid
            parentChildren={parentChildren}
            studentClassGrade={parentFirstChildGrade}
            avgScore={parentAvgScore}
            completedCount={parentCompletedCount}
            isLoading={parentIsLoading}
          />
        )}
      </div>

      {currentRole === "SCHOOL_ADMIN" && (
        <AdminDashboardContent
          academicYear={schoolAdminAcademicYear}
          recentActivity={schoolAdminActivity}
          isLoading={adminIsLoading}
        />
      )}

      {currentRole === "TEACHER" && (
        <TeacherDashboardContent
          isDemoMode={isDemoMode}
          teacherClasses={teacherClasses}
          isLoading={teacherIsLoading}
          isLoadingLive={isLoadingLive}
          liveFetchError={liveFetchError}
          displayAssessments={displayAssessments}
          submissions={submissions}
        />
      )}

      {currentRole === "STUDENT" && (
        <StudentDashboardContent
          isDemoMode={isDemoMode}
          studentClass={studentClass}
          isLoading={studentIsLoading}
          isLoadingLive={isLoadingLive}
          liveFetchError={liveFetchError}
          displayAssessments={displayAssessments}
          studentRecentResults={studentRecentResults}
        />
      )}

      {currentRole === "PARENT" && (
        <ParentDashboardContent
          isDemoMode={isDemoMode}
          parentChildren={parentChildren}
          parentRecentResults={parentRecentResults}
          isLoading={parentIsLoading}
        />
      )}
    </div>
  );
}
