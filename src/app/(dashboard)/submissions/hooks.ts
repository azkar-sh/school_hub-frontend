import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubmissions, SubmissionRow } from "@/lib/mock-data";
import { submissionsApi, parentStudentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { Submission } from "@/types";

export const STATUS_FILTERS = ["ALL", "SUBMITTED", "GRADED"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

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

import { useSearchParams } from "next/navigation";

export function useSubmissionsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as StatusFilter) || "ALL";
  const initialAssessment = searchParams.get("assessmentTitle") || "ALL";

  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    STATUS_FILTERS.includes(initialStatus) ? initialStatus : "ALL",
  );
  const [assessmentFilter, setAssessmentFilter] =
    React.useState<string>(initialAssessment);
  const [subjectFilter, setSubjectFilter] = React.useState<string>("ALL");

  // Synchronize when searchParams change
  React.useEffect(() => {
    const statusParam = searchParams.get("status") as StatusFilter;
    if (statusParam && STATUS_FILTERS.includes(statusParam)) {
      setStatusFilter(statusParam);
    }
    const asmParam = searchParams.get("assessmentTitle");
    if (asmParam) {
      setAssessmentFilter(asmParam);
    }
  }, [searchParams]);

  // Live fetch for parents (fetch child wards)
  React.useEffect(() => {
    if (isDemoMode) return;
    if (currentRole === "PARENT") {
      parentStudentsApi.getChildren().catch(() => {});
    }
  }, [isDemoMode, currentRole]);

  // Load the role-aware submission history from the backend. Demo mode keeps
  // mock data so the page is still browsable without a server.
  const {
    data: liveSubmissionsData,
    isLoading: isLoadingSubmissions,
  } = useFetchData<SubmissionRow[]>(
    () =>
      submissionsApi
        .findAll()
        .then((res) =>
          Array.isArray(res.data) ? res.data.map(toSubmissionRow) : [],
        ),
    [],
    !isDemoMode,
  );

  const displaySubmissions = React.useMemo(() => {
    return isDemoMode
      ? getMockSubmissions(currentRole)
      : (liveSubmissionsData ?? []);
  }, [isDemoMode, currentRole, liveSubmissionsData]);

  // Derive unique assessment titles and subjects for filter dropdowns
  const assessmentOptions = React.useMemo(() => {
    const titles = new Set<string>();
    displaySubmissions.forEach((s) => {
      if (s.assessmentTitle) titles.add(s.assessmentTitle);
    });
    return Array.from(titles);
  }, [displaySubmissions]);

  const subjectOptions = React.useMemo(() => {
    const subjects = new Set<string>();
    displaySubmissions.forEach((s) => {
      if (s.subject && s.subject !== "—") subjects.add(s.subject);
    });
    return Array.from(subjects);
  }, [displaySubmissions]);

  // Client-side filtering
  const filteredSubmissions = React.useMemo(() => {
    return displaySubmissions.filter((sub) => {
      const matchesStatus =
        statusFilter === "ALL" || sub.status === statusFilter;
      const matchesAssessment =
        assessmentFilter === "ALL" || sub.assessmentTitle === assessmentFilter;
      const matchesSubject =
        subjectFilter === "ALL" || sub.subject === subjectFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        sub.studentName.toLowerCase().includes(q) ||
        sub.assessmentTitle.toLowerCase().includes(q) ||
        sub.subject.toLowerCase().includes(q);
      return (
        matchesStatus && matchesAssessment && matchesSubject && matchesSearch
      );
    });
  }, [
    displaySubmissions,
    statusFilter,
    assessmentFilter,
    subjectFilter,
    search,
  ]);

  const pendingSubmissions = React.useMemo(() => {
    return displaySubmissions.filter((s) => s.status === "SUBMITTED");
  }, [displaySubmissions]);

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
    setSearch,
    statusFilter,
    setStatusFilter,
    assessmentFilter,
    setAssessmentFilter,
    assessmentOptions,
    subjectFilter,
    setSubjectFilter,
    subjectOptions,
    filteredSubmissions,
    isLoadingSubmissions,
    firstPendingSubmissionId,
    pendingCount,
  };
}

