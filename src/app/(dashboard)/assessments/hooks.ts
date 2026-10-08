import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockAssessments, MockAssessment } from "@/lib/mock-data";
import { assessmentsApi, teachingAssignmentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { Assessment, Subject, TeachingAssignment } from "@/types";

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
  const dueAt = a.dueAt
    ? new Date(a.dueAt).toLocaleDateString("id-ID")
    : "No due date"; // i18n: TODO

  if (role === "TEACHER") {
    return {
      id: a.id,
      title: a.title,
      type: a.type as DisplayItem["type"],
      subject,
      class: a.teachingAssignment?.class?.name ?? "—",
      dueAt,
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
    dueAt,
    questionsCount,
    class: a.teachingAssignment?.class?.name ?? "—",
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

  const searchParams = useSearchParams();
  const statusParam = searchParams?.get("status");

  // UI state — search/filter drive backend query (server-side)
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<string[]>([]);
  const [filterSubject, setFilterSubject] = React.useState<string[]>([]);
  const [filterClass, setFilterClass] = React.useState<string[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string[]>(
    statusParam ? [statusParam] : [],
  );
  const [page, setPage] = React.useState(1);
  const limit = 10;

  // Synchronize when searchParams status changes (e.g. navigation from dashboard)
  React.useEffect(() => {
    const s = searchParams?.get("status");
    if (s) {
      setFilterStatus([s]);
      setPage(1);
    }
  }, [searchParams]);

  // Subject options for filter dropdown — derived for demo, fetched for live
  const [subjectOptions, setSubjectOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [classOptions, setClassOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  // Reset page when search/filter changes (new query -> start at 1)
  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilterTypeChange = React.useCallback(
    (value: string | string[]) => {
      setFilterType(
        Array.isArray(value) ? value : value === "ALL" ? [] : [value],
      );
      setPage(1);
    },
    [],
  );

  const handleFilterClassChange = React.useCallback(
    (value: string | string[]) => {
      setFilterClass(
        Array.isArray(value) ? value : value === "ALL" ? [] : [value],
      );
      setPage(1);
    },
    [],
  );

  const handleFilterSubjectChange = React.useCallback(
    (value: string | string[]) => {
      setFilterSubject(
        Array.isArray(value) ? value : value === "ALL" ? [] : [value],
      );
      setPage(1);
    },
    [],
  );

  const handleFilterStatusChange = React.useCallback(
    (value: string | string[]) => {
      setFilterStatus(
        Array.isArray(value) ? value : value === "ALL" ? [] : [value],
      );
      setPage(1);
    },
    [],
  );

  // Demo: derive subject options from mock data (no effect needed)
  const demoSubjectOptions = React.useMemo(
    () =>
      Array.from(
        new Set(getMockAssessments(currentRole).map((a) => a.class)),
      ).map((name) => ({ value: name, label: name })),
    [currentRole],
  );
  const demoClassOptions = React.useMemo(
    () =>
      Array.from(
        new Set(getMockAssessments(currentRole).map((a) => a.subject)),
      ).map((name) => ({ value: name, label: name })),
    [currentRole],
  );

  // Live: fetch subject options (async setState is fine — not synchronous)
  React.useEffect(() => {
    if (isDemoMode) return;
    let cancelled = false;
    if (currentRole === "TEACHER" && user?.id) {
      teachingAssignmentsApi
        .findByTeacher(user.id)
        .then((res) => {
          if (cancelled) return;
          const list: TeachingAssignment[] = Array.isArray(res.data)
            ? res.data
            : [];
          const opts = Array.from(
            new Map(
              list
                .filter((ta) => ta.subject)
                .map(
                  (ta) =>
                    [
                      ta.subject!.id,
                      { value: ta.subject!.id, label: ta.subject!.name },
                    ] as const,
                ),
            ).values(),
          );
          const classOptions = Array.from(
            new Map(
              list
                .filter((ta) => ta.class)
                .map(
                  (ta) =>
                    [
                      ta.class!.id,
                      { value: ta.class!.id, label: ta.class!.name },
                    ] as const,
                ),
            ).values(),
          );
          setSubjectOptions(opts);
          setClassOptions(classOptions);
        })
        .catch(() => {});
    } else if (currentRole === "STUDENT") {
      assessmentsApi
        .findSubjectsForStudent()
        .then((res) => {
          if (cancelled) return;
          const list: Subject[] = Array.isArray(res.data) ? res.data : [];
          setSubjectOptions(list.map((s) => ({ value: s.id, label: s.name })));
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [isDemoMode, currentRole, user?.id]);

  const effectiveSubjectOptions = isDemoMode
    ? demoSubjectOptions
    : subjectOptions;
  const effectiveClassOptions = isDemoMode ? demoClassOptions : classOptions;

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

      const params: Record<string, string | number | string[]> = {
        page,
        limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterType.length > 0) params.type = filterType;
      if (filterSubject.length > 0) params.subjectId = filterSubject;
      if (filterClass.length > 0) params.classId = filterClass;
      if (filterStatus.length > 0) params.status = filterStatus;

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
    [
      shouldFetchLive,
      currentRole,
      page,
      limit,
      debouncedSearch,
      filterType,
      filterSubject,
      filterClass,
      filterStatus,
    ],
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

  // In demo mode, filter mock data by type, subject, status, and search (client-side)
  // In live mode, rely on backend filtering (no client-side filter)
  const filteredItems = React.useMemo(() => {
    if (isDemoMode) {
      return mockItems.filter((item) => {
        const matchesType =
          filterType.length === 0 ||
          filterType.includes(item.type as DisplayItem["type"]);
        const matchesSubject =
          filterSubject.length === 0 || filterSubject.includes(item.subject);
        const matchesStatus =
          filterStatus.length === 0 ||
          filterStatus.some((s) => {
            const upper = s.toUpperCase();
            if (upper === "PENDING" || upper === "AWAITING_SUBMISSION") {
              return item.status === "AVAILABLE" || item.status === "DRAFT";
            }
            if (upper === "COMPLETED") {
              return item.status === "SUBMITTED" || item.status === "GRADED";
            }
            return item.status === upper;
          });
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q);
        return matchesType && matchesSubject && matchesStatus && matchesSearch;
      });
    }
    return liveItems;
  }, [
    mockItems,
    filterType,
    filterSubject,
    filterStatus,
    search,
    liveItems,
    isDemoMode,
  ]);

  const meta = isDemoMode
    ? {
        page: 1,
        limit: filteredItems.length,
        total: filteredItems.length,
        totalPages: 1,
      }
    : liveMeta;

  // Action label based on role and item status
  const actionLabel = (item: DisplayItem) => {
    if (currentRole === "TEACHER") return "Manage"; // i18n: TODO
    if (currentRole === "PARENT") return "View Results"; // i18n: TODO
    if (item.status === "GRADED") return "Review Score"; // i18n: TODO
    if (item.status === "SUBMITTED") return "Review"; // i18n: TODO
    if (item.status === "DRAFT") return "Continue Assessment"; // i18n: TODO
    return "Start Assessment"; // i18n: TODO
  };

  return {
    isDemoMode,
    currentRole,
    search,
    filterType,
    filterSubject,
    filterClass,
    filterStatus,
    subjectOptions: effectiveSubjectOptions,
    handleSearchChange,
    handleFilterTypeChange,
    handleFilterSubjectChange,
    handleFilterClassChange,
    handleFilterStatusChange,
    classOptions: effectiveClassOptions,
    setPage,
    isLoading: isLoadingLive,
    fetchError: isErrorLive,
    filtered: filteredItems,
    meta,
    actionLabel,
  };
}
