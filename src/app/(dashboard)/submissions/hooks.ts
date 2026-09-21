import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubmissions, SubmissionRow } from "@/lib/mock-data";
import { submissionsApi, teachingAssignmentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { Submission, TeachingAssignment } from "@/types";

export const STATUS_FILTERS = ["ALL", "SUBMITTED", "GRADED"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type DisplayItem = SubmissionRow;

function formatSubmittedAt(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function toSubmissionRow(s: Submission): SubmissionRow {
  return {
    id: s.id,
    studentName: s.student?.name ?? s.studentId,
    assessmentTitle: s.assessment?.title ?? "Untitled Assessment",
    subject: s.assessment?.teachingAssignment?.subject?.name ?? "—",
    score: s.scorePercentage ?? null,
    submittedAt: formatSubmittedAt(s.submittedAt),
    status: s.status === "GRADED" ? "GRADED" : "SUBMITTED",
  };
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function useSubmissionsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role ?? activeRole;

  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string[]>([]);
  const [filterSubject, setFilterSubject] = React.useState<string[]>([]);
  const [filterClass, setFilterClass] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [subjectOptions, setSubjectOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [classOptions, setClassOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilterStatusChange = React.useCallback(
    (value: string | string[]) => {
      setFilterStatus(
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

  const handleFilterClassChange = React.useCallback(
    (value: string | string[]) => {
      setFilterClass(
        Array.isArray(value) ? value : value === "ALL" ? [] : [value],
      );
      setPage(1);
    },
    [],
  );

  const demoSubjectOptions = React.useMemo(
    () =>
      Array.from(
        new Set(getMockSubmissions(currentRole).map((a) => a.subject)),
      ).map((name) => ({ value: name, label: name })),
    [currentRole],
  );

  const demoClassOptions = React.useMemo(
    () =>
      Array.from(
        new Set(getMockSubmissions(currentRole).map((a) => a.subject)),
      ).map((name) => ({ value: name, label: name })),
    [currentRole],
  );

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
          const subjectOpts = Array.from(
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
          const classOpts = Array.from(
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
          setSubjectOptions(subjectOpts);
          setClassOptions(classOpts);
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

  const debouncedSearch = useDebouncedValue(search, 350);

  const shouldFetchLive =
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT" || currentRole === "PARENT");

  const {
    data: liveData,
    isLoading: isLoadingLive,
    error: isErrorLive,
    refetch: refetchList,
  } = useFetchData<{
    submissions: Submission[];
    meta: PaginationMeta;
  }>(
    async () => {
      if (!shouldFetchLive)
        return {
          submissions: [],
          meta: { page: 1, limit, total: 0, totalPages: 0 },
        };

      const params: Record<string, string | number | string[]> = {
        page,
        limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterStatus.length > 0) params.status = filterStatus;
      if (filterSubject.length > 0) params.subjectId = filterSubject;
      if (filterClass.length > 0) params.classId = filterClass;

      const res = await submissionsApi.findAll(params);
      return res.data as unknown as {
        submissions: Submission[];
        meta: PaginationMeta;
      };
    },
    [
      shouldFetchLive,
      currentRole,
      page,
      limit,
      debouncedSearch,
      filterStatus,
      filterSubject,
      filterClass,
    ],
    shouldFetchLive,
  );

  // Separate fetch for unfiltered pending count (for "Start Grading" button)
  const { data: pendingData } = useFetchData<{
    submissions: Submission[];
    meta: { total: number };
  }>(
    async () => {
      if (!shouldFetchLive)
        return { submissions: [], meta: { total: 0 } };
      const res = await submissionsApi.findAll({
        status: "SUBMITTED",
        limit: 100,
      });
      return res.data as unknown as {
        submissions: Submission[];
        meta: { total: number };
      };
    },
    [shouldFetchLive, currentRole],
    shouldFetchLive,
  );

  const liveItems = React.useMemo(() => {
    if (!liveData) return [];
    return liveData.submissions.map((s) => toSubmissionRow(s));
  }, [liveData]);

  const liveMeta = React.useMemo(() => {
    if (!liveData) return { page: 1, limit, total: 0, totalPages: 0 };
    return liveData.meta;
  }, [liveData]);

  const mockItems = React.useMemo(
    () => (isDemoMode ? getMockSubmissions(currentRole) : []),
    [isDemoMode, currentRole],
  );

  const filteredItems = React.useMemo(() => {
    if (isDemoMode) {
      return mockItems.filter((item) => {
        const matchesStatus =
          filterStatus.length === 0 ||
          filterStatus.includes(item.status as DisplayItem["status"]);
        const matchesSubject =
          filterSubject.length === 0 || filterSubject.includes(item.subject);
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          item.studentName.toLowerCase().includes(q) ||
          item.assessmentTitle.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q);
        return matchesStatus && matchesSubject && matchesSearch;
      });
    }
    return liveItems;
  }, [
    mockItems,
    filterStatus,
    filterSubject,
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

  // Compute pending from unfiltered data (not filteredItems)
  const pendingSubmissions = React.useMemo(() => {
    if (isDemoMode) {
      return mockItems.filter((s) => s.status === "SUBMITTED");
    }
    return (pendingData?.submissions ?? []).map((s) => toSubmissionRow(s));
  }, [isDemoMode, mockItems, pendingData]);

  const firstPendingSubmissionId = pendingSubmissions[0]?.id || null;
  const pendingCount = pendingSubmissions.length;

  const pageTitle =
    currentRole === "TEACHER"
      ? "Student Submissions & Grading Hub"
      : currentRole === "PARENT"
        ? "Child's Submission History"
        : "My Submission History";

  const pageDescription =
    currentRole === "TEACHER"
      ? "Review student answer submissions, grade short answers, and check score metrics"
      : currentRole === "PARENT"
        ? "Track your child's quiz attempts, scores, and grading status"
        : "Your past quiz attempts, submitted assignments, and graded results";

  return {
    currentRole,
    isDemoMode,
    pageTitle,
    pageDescription,
    search,
    handleSearchChange,
    filterStatus,
    handleFilterStatusChange,
    filterSubject,
    handleFilterSubjectChange,
    filterClass,
    handleFilterClassChange,
    subjectOptions: effectiveSubjectOptions,
    classOptions: effectiveClassOptions,
    filtered: filteredItems,
    isLoading: isLoadingLive,
    fetchError: isErrorLive,
    refetchList,
    meta,
    setPage,
    firstPendingSubmissionId,
    pendingCount,
  };
}

export { toSubmissionRow };