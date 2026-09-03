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

export function useSubmissionsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");

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

  const displaySubmissions = isDemoMode
    ? getMockSubmissions(currentRole)
    : (liveSubmissionsData ?? []);

  // Client-side filtering by status + search (student name / assessment title)
  const filteredSubmissions = displaySubmissions.filter((sub) => {
    const matchesStatus =
      statusFilter === "ALL" || sub.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      sub.studentName.toLowerCase().includes(q) ||
      sub.assessmentTitle.toLowerCase().includes(q) ||
      sub.subject.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

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
    filteredSubmissions,
    isLoadingSubmissions,
  };
}
