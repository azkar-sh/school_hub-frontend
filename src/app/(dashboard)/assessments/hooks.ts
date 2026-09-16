import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockAssessments, MockAssessment } from "@/lib/mock-data";
import { assessmentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { Assessment } from "@/types";

/**
 * Pagination meta returned by backend (page/limit/total/totalPages)
 */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Display shape stays close to MockAssessment so existing card UI works.
// Backend Assessment already carries _count + teachingAssignment + submissions.
type DisplayItem = MockAssessment;

// Mapper: backend Assessment -> DisplayItem
function toDisplayItem(a: Assessment, role: string): DisplayItem {
  const subject = a.teachingAssignment?.subject?.name ?? "—";
  const questionsCount = a._count?.questions ?? a.questions?.length ?? 0;
  const due = a.dueAt ? new Date(a.dueAt).toLocaleDateString() : "No due date";

  if (role === "TEACHER") {
    return {
      id: a.id,
      title: a.title,
      type: a.type as DisplayItem["type"],
      subject,
      due,
      questionsCount,
      points: 0,
      status: "AVAILABLE",
      submissionsCount: a._count?.submissions,
      avgScore: undefined,
    };
  }

  const sub = a.submissions?.[0];
  const rawStatus = sub?.status ?? "AVAILABLE";
  const status: DisplayItem["status"] =
    rawStatus === "DRAFT"
      ? "DRAFT"
      : rawStatus === "SUBMITTED"
        ? "SUBMITTED"
        : rawStatus === "GRADED"
          ? "GRADED"
          : "AVAILABLE";

  return {
    id: a.id,
    title: a.title,
    type: a.type as DisplayItem["type"],
    subject,
    due,
    questionsCount,
    points: 0,
    status,
    submissionId: sub?.id,
    score:
      sub?.score !== undefined && sub?.score !== null
        ? Number(sub.score)
        : undefined,
    submittedAt: sub?.submittedAt ?? undefined,
  };
}

// Simple debounce hook — delays search until user stops typing
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function useAssessmentsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role ?? activeRole;

  // UI state — search/filter drive backend query (server-side)
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  // Reset page when search/filter changes (new query -> start at 1)
  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilterTypeChange = React.useCallback((type: string) => {
    setFilterType(type);
    setPage(1);
  }, []);

  // Debounce search so we don't hit API on every keystroke
  const debouncedSearch = useDebouncedValue(search, 350);

  const shouldFetchLive =
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT");

  // Live fetch state
  const {
    data: liveData,
    isLoading: isLoadingLive,
    error: isErrorLive,
  } = useFetchData<{ assessments: Assessment[]; meta: PaginationMeta }>(
    async () => {
      if (!shouldFetchLive)
        return {
          assessments: [],
          meta: { page: 1, limit, total: 0, totalPages: 0 },
        };

      // Backend expects subjectId as foreign key, not assessment type.
      // Keep type filter client-side to avoid breaking existing UX.
      // If backend later exposes `type` filter, add it here as `type: filterType`.
      const params: Record<string, string | number> = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;

      const req =
        currentRole === "TEACHER"
          ? assessmentsApi.findForTeacher(params)
          : assessmentsApi.findForStudent(params);

      const res = await req;
      return res.data as unknown as {
        assessments: Assessment[];
        meta: PaginationMeta;
      };
    },
    [shouldFetchLive, currentRole, page, limit, debouncedSearch],
    shouldFetchLive,
  );

  // Transform live data
  const liveItems = React.useMemo(() => {
    if (!liveData) return [];
    return liveData.assessments.map((a) => toDisplayItem(a, currentRole));
  }, [liveData, currentRole]);

  const liveMeta = React.useMemo(() => {
    if (!liveData) return { page: 1, limit, total: 0, totalPages: 0 };
    return liveData.meta;
  }, [liveData]);

  // Source: mock in demo mode, live otherwise
  const mockItems = React.useMemo(
    () => (isDemoMode ? getMockAssessments(currentRole) : []),
    [isDemoMode, currentRole],
  );

  const sourceItems = isDemoMode ? mockItems : liveItems;
  const meta = isDemoMode
    ? {
        page: 1,
        limit: sourceItems.length,
        total: sourceItems.length,
        totalPages: 1,
      }
    : liveMeta;

  // Client-side type filter (assessment.type = QUIZ | EXAM | ASSIGNMENT)
  // Kept here because backend FindAssessmentDto currently only filters by
  // subjectId — type filter would need backend support to move server-side.
  const filtered = React.useMemo(
    () =>
      sourceItems.filter((item) => {
        const matchesType = filterType === "ALL" || item.type === filterType;
        if (isDemoMode) {
          const q = search.toLowerCase();
          const matchesSearch =
            !q ||
            item.title.toLowerCase().includes(q) ||
            item.subject.toLowerCase().includes(q);
          return matchesSearch && matchesType;
        }
        return matchesType;
      }),
    [sourceItems, filterType, isDemoMode, search],
  );

  // Action label based on role and item status
  const actionLabel = (item: DisplayItem) => {
    if (currentRole === "TEACHER") return "Manage Questions";
    if (currentRole === "PARENT") return "View Results";
    if (item.status === "GRADED") return "Review Score";
    if (item.status === "SUBMITTED") return "Review";
    if (item.status === "DRAFT") return "Continue Assessment";
    return "Start Assessment";
  };

  return {
    isDemoMode,
    currentRole,
    search,
    filterType,
    handleSearchChange,
    handleFilterTypeChange,
    setPage,
    isLoading: isLoadingLive,
    fetchError: isErrorLive,
    filtered,
    meta,
    actionLabel,
  };
}
