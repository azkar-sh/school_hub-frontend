import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  useSchoolContextStore,
  CachedSchool,
} from "@/stores/use-school-context-store";
import { schoolsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { School } from "@/types";

interface UseSchoolSelectionOptions {
  /**
   * When true (and the user is a SCHOOL_ADMIN), fetch every school in the
   * system via `schoolsApi.findAll()` so the admin can manage schools they
   * are not yet a member of. Other roles always see only their own schools.
   */
  fetchAllForAdmin?: boolean;
}

interface SchoolSelection {
  schools: CachedSchool[];
  selectedSchoolId: string;
  setSelectedSchoolId: (id: string) => void;
  isLoading: boolean;
  /** Re-run the `findAll` query (only meaningful when `fetchAllForAdmin` is true). */
  refetch: () => void;
}

/**
 * Centralized school selection used by every dashboard page.
 *
 * - The active school is cached in `useSchoolContextStore` and persisted to
 *   localStorage, so the user's school survives navigation & reloads.
 * - For TEACHER / STUDENT / PARENT only the schools they are a member of are
 *   listed — they never see another school's data.
 * - For SCHOOL_ADMIN, passing `fetchAllForAdmin: true` lists every school in
 *   the system (for management screens) while still defaulting the selection
 *   to the admin's own school.
 */
export function useSchoolSelection(
  options: UseSchoolSelectionOptions = {},
): SchoolSelection {
  const { fetchAllForAdmin = false } = options;
  const { user, isDemoMode } = useAuthStore();
  const { userSchools, activeSchoolId, setActiveSchool } =
    useSchoolContextStore();

  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const shouldFetchAll = !isDemoMode && isAdmin && fetchAllForAdmin;

  const { data: allSchoolsData, isLoading, refetch } = useFetchData<School[]>(
    () =>
      schoolsApi
        .findAll()
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [],
    shouldFetchAll,
  );

  const schools: CachedSchool[] = React.useMemo(() => {
    if (shouldFetchAll && allSchoolsData) {
      return allSchoolsData.map((s) => ({ id: s.id, name: s.name }));
    }
    return userSchools;
  }, [shouldFetchAll, allSchoolsData, userSchools]);

  return {
    schools,
    selectedSchoolId: activeSchoolId,
    setSelectedSchoolId: setActiveSchool,
    isLoading,
    refetch,
  };
}
