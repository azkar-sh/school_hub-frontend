import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import {
  getMockRecentAssessments,
  getMockSchoolAdminOverview,
  getMockSchoolAdminAcademicYear,
  getMockSchoolAdminRecentActivity,
  getMockTeacherDashboardClasses,
  getMockStudentClassInfo,
  getMockStudentRecentResults,
  getMockParentChildren,
  getMockParentRecentResults,
} from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";

export interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  questions?: unknown[];
  submissionsCount?: number;
}

export interface DisplayAssessment {
  id: string;
  title: string;
  type: string;
  subject?: string;
  due: string;
  questionsCount: number;
  points: number;
}

export function useDashboardPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  // Live data (only fetched when not in demo mode)
  const shouldFetchLive =
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT");
  const liveEndpoint =
    currentRole === "TEACHER"
      ? "/assessments/teacher"
      : currentRole === "STUDENT"
        ? "/assessments/student"
        : null;

  const {
    data: liveAssessmentsData,
    isLoading: isLoadingLive,
    error: liveFetchError,
  } = useFetchData<LiveAssessment[]>(
    () =>
      apiClient
        .get<LiveAssessment[]>(liveEndpoint!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    shouldFetchLive && !!liveEndpoint,
  );
  const liveAssessments = liveAssessmentsData ?? [];

  // Decide which assessment rows to show
  const mockRecentItems = getMockRecentAssessments(currentRole);
  const displayAssessments: DisplayAssessment[] = isDemoMode
    ? mockRecentItems
    : liveAssessments.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        due: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : "No due date",
        questionsCount: a.questions?.length ?? 0,
        points: 0,
      }));

  // Mock data for role-specific sections
  const schoolAdminOverview = getMockSchoolAdminOverview();
  const schoolAdminAcademicYear = getMockSchoolAdminAcademicYear();
  const schoolAdminActivity = getMockSchoolAdminRecentActivity();
  const teacherClasses = getMockTeacherDashboardClasses();
  const studentClass = getMockStudentClassInfo();
  const studentRecentResults = getMockStudentRecentResults();
  const parentChildren = getMockParentChildren();
  const parentRecentResults = getMockParentRecentResults();

  return {
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
    teacherClasses,
    studentClass,
    studentRecentResults,
    parentChildren,
    parentRecentResults,
  };
}
