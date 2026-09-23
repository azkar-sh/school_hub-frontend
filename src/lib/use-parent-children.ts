import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { parentStudentsApi, submissionsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import {
  LiveSubmission,
  StudentSubjectResult,
  avg,
  groupSubmissionsBySubject,
} from "@/lib/result-grouping";
import { ParentChildLink } from "@/types";

export interface ParentChildSummary {
  id: string;
  name: string;
  email?: string;
  relationship?: string;
  className: string;
  grade: number | null;
  assessmentCount: number;
  average: number;
  subjects: StudentSubjectResult[];
}

/**
 * Derive a display class label + grade from a child's enrollments. Picks the
 * first enrollment (the backend returns them ordered, most recent first).
 */
function extractClassInfo(link: ParentChildLink): {
  className: string;
  grade: number | null;
} {
  const enrollments = link.student.enrollments ?? [];
  if (enrollments.length === 0) return { className: "—", grade: null };
  const enr = enrollments[0];
  return {
    className: enr.class?.name ?? "—",
    grade: enr.class?.grade ?? null,
  };
}

/**
 * Fetches the current parent's children (with enrollment/class info) and their
 * role-scoped submissions, then merges them into display-ready summaries with
 * per-subject result groupings.
 *
 * Only fetches for an authenticated PARENT in live mode. Returns empty arrays
 * otherwise so callers can fall back to mock data for demo/preview sessions.
 */
export function useParentChildren() {
  const { user, isDemoMode } = useAuthStore();
  const enabled = !isDemoMode && user?.role === "PARENT";

  const { data: childrenLinks, isLoading: childrenLoading } = useFetchData<
    ParentChildLink[]
  >(
    () =>
      parentStudentsApi
        .getChildren(user?.id)
        .then((res) =>
          Array.isArray(res.data) ? (res.data as ParentChildLink[]) : [],
        ),
    [user?.id],
    enabled,
  );

  const { data: submissionsData, isLoading: submissionsLoading } =
    useFetchData<LiveSubmission[]>(
      () =>
        submissionsApi
          .findAll({ limit: 1000 })
          .then((res) =>
            Array.isArray(res.data) ? res.data : (res.data?.submissions ?? []),
          ),
      [user?.id],
      enabled,
    );

  const children: ParentChildSummary[] = React.useMemo(() => {
    if (!enabled) return [];
    const links = childrenLinks ?? [];
    const subs = submissionsData ?? [];

    const subsByStudent = new Map<string, LiveSubmission[]>();
    subs.forEach((s) => {
      const sid = s.student?.id;
      if (!sid) return;
      const arr = subsByStudent.get(sid) ?? [];
      arr.push(s);
      subsByStudent.set(sid, arr);
    });

    return links.map((link) => {
      const sid = link.student.id;
      const studentSubs = subsByStudent.get(sid) ?? [];
      const subjects = groupSubmissionsBySubject(studentSubs);
      const allScores = subjects.flatMap((subj) =>
        subj.assessments
          .map((a) => a.scorePercentage)
          .filter((v): v is number => v !== null),
      );
      const { className, grade } = extractClassInfo(link);
      return {
        id: sid,
        name: link.student.name,
        email: link.student.email,
        relationship: link.relationship,
        className,
        grade,
        assessmentCount: subjects.reduce((n, s) => n + s.assessmentCount, 0),
        average: avg(allScores),
        subjects,
      };
    });
  }, [childrenLinks, submissionsData, enabled]);

  return {
    isDemoMode,
    isLoading: childrenLoading || submissionsLoading,
    children,
  };
}
