import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { apiClient } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";

export interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  questions?: unknown[];
  submissions?: Array<{
    id: string;
    score?: number | string;
    student?: { name: string };
  }>;
}

export function useResultsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  const shouldFetchLive =
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT");
  const liveEndpoint =
    currentRole === "TEACHER"
      ? "/assessments/teacher"
      : currentRole === "STUDENT"
        ? "/assessments/student"
        : null;

  const { data: liveAssessmentsData, isLoading } = useFetchData<
    LiveAssessment[]
  >(
    () =>
      apiClient
        .get<LiveAssessment[]>(liveEndpoint!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    shouldFetchLive && !!liveEndpoint,
  );
  const liveAssessments = liveAssessmentsData ?? [];

  return { isDemoMode, currentRole, liveAssessments, isLoading };
}
