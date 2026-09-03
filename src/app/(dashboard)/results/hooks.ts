import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { submissionsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";

interface LiveSubmissionAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  teachingAssignment?: {
    subject?: { id: string; name: string; code: string };
    class?: { id: string; name: string };
  };
}

interface LiveSubmission {
  id: string;
  status: string;
  score?: number | string | null;
  scorePercentage?: number | null;
  submittedAt?: string | null;
  student?: { id: string; name: string; email?: string };
  assessment?: LiveSubmissionAssessment;
}

export interface StudentAssessmentResult {
  id: string;
  submissionId?: string;
  title: string;
  type: string;
  scorePercentage: number | null;
  submittedAt?: string;
  status: string;
}

export interface StudentSubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  averageScore: number;
  assessmentCount: number;
  assessments: StudentAssessmentResult[];
}

export interface TeacherAssessmentResult {
  assessmentId: string;
  submissionId: string;
  title: string;
  type: string;
  classId: string;
  className: string;
  scorePercentage: number | null;
  submittedAt?: string;
  status: string;
}

export interface TeacherStudentResult {
  studentId: string;
  studentName: string;
  averageScore: number;
  assessmentCount: number;
  assessments: TeacherAssessmentResult[];
}

export interface TeacherSubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  averageScore: number;
  studentCount: number;
  students: TeacherStudentResult[];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

export function useResultsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // Both TEACHER and STUDENT consume `/submissions` (role-scoped by the
  // backend). Teachers get all submissions for their assessments (with
  // student + subject + class + scorePercentage); students get their own.
  const shouldFetch =
    !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT");

  const { data: submissionsData, isLoading } = useFetchData<LiveSubmission[]>(
    () =>
      submissionsApi
        .findAll()
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    shouldFetch,
  );

  // --- Student grouping: subject -> assessments (history) ---
  const studentSubjects: StudentSubjectResult[] = React.useMemo(() => {
    if (currentRole !== "STUDENT") return [];
    const subs = submissionsData ?? [];
    const graded = subs.filter(
      (s) => s.status === "SUBMITTED" || s.status === "GRADED",
    );

    const bySubject = new Map<string, StudentSubjectResult>();

    graded.forEach((s) => {
      const subject = s.assessment?.teachingAssignment?.subject;
      const subjectId = subject?.id ?? "unknown";
      const assessment = s.assessment;

      const item: StudentAssessmentResult = {
        id: assessment?.id ?? s.id,
        submissionId: s.id,
        title: assessment?.title ?? "Assessment",
        type: assessment?.type ?? "QUIZ",
        scorePercentage:
          s.scorePercentage !== undefined && s.scorePercentage !== null
            ? Number(s.scorePercentage)
            : null,
        submittedAt: s.submittedAt ?? undefined,
        status: s.status,
      };

      const existing = bySubject.get(subjectId);
      if (existing) {
        existing.assessments.push(item);
        existing.assessmentCount += 1;
      } else {
        bySubject.set(subjectId, {
          subjectId,
          subjectName: subject?.name ?? "Unknown Subject",
          subjectCode: subject?.code ?? "—",
          averageScore: 0,
          assessmentCount: 1,
          assessments: [item],
        });
      }
    });

    bySubject.forEach((subj) => {
      const scored = subj.assessments
        .map((a) => a.scorePercentage)
        .filter((v): v is number => v !== null);
      subj.averageScore = avg(scored);
    });

    return Array.from(bySubject.values());
  }, [submissionsData, currentRole]);

  // --- Teacher grouping: subject -> student -> assessments ---
  const teacherSubjects: TeacherSubjectResult[] = React.useMemo(() => {
    if (currentRole !== "TEACHER") return [];
    const subs = submissionsData ?? [];
    const graded = subs.filter(
      (s) => s.status === "SUBMITTED" || s.status === "GRADED",
    );

    // subjectId -> TeacherSubjectResult (with student map built alongside)
    const bySubject = new Map<string, TeacherSubjectResult>();
    // subjectId -> (studentId -> TeacherStudentResult)
    const studentMaps = new Map<
      string,
      Map<string, TeacherStudentResult>
    >();

    graded.forEach((s) => {
      const subject = s.assessment?.teachingAssignment?.subject;
      const cls = s.assessment?.teachingAssignment?.class;
      const subjectId = subject?.id ?? "unknown";
      const assessment = s.assessment;
      const student = s.student;

      const item: TeacherAssessmentResult = {
        assessmentId: assessment?.id ?? s.id,
        submissionId: s.id,
        title: assessment?.title ?? "Assessment",
        type: assessment?.type ?? "QUIZ",
        classId: cls?.id ?? "unknown",
        className: cls?.name ?? "—",
        scorePercentage:
          s.scorePercentage !== undefined && s.scorePercentage !== null
            ? Number(s.scorePercentage)
            : null,
        submittedAt: s.submittedAt ?? undefined,
        status: s.status,
      };

      let subj = bySubject.get(subjectId);
      let studentMap = studentMaps.get(subjectId);
      if (!subj || !studentMap) {
        subj = {
          subjectId,
          subjectName: subject?.name ?? "Unknown Subject",
          subjectCode: subject?.code ?? "—",
          averageScore: 0,
          studentCount: 0,
          students: [],
        };
        studentMap = new Map();
        bySubject.set(subjectId, subj);
        studentMaps.set(subjectId, studentMap);
      }

      const studentId = student?.id ?? "unknown";
      let stu = studentMap.get(studentId);
      if (!stu) {
        stu = {
          studentId,
          studentName: student?.name ?? "Unknown Student",
          averageScore: 0,
          assessmentCount: 0,
          assessments: [],
        };
        studentMap.set(studentId, stu);
        subj.students.push(stu);
        subj.studentCount += 1;
      }
      stu.assessments.push(item);
      stu.assessmentCount += 1;
    });

    // Compute averages
    bySubject.forEach((subj) => {
      const allScores: number[] = [];
      subj.students.forEach((stu) => {
        const scored = stu.assessments
          .map((a) => a.scorePercentage)
          .filter((v): v is number => v !== null);
        stu.averageScore = avg(scored);
        allScores.push(...scored);
      });
      subj.averageScore = avg(allScores);
    });

    return Array.from(bySubject.values());
  }, [submissionsData, currentRole]);

  return {
    isDemoMode,
    currentRole,
    isLoading,
    studentSubjects,
    teacherSubjects,
  };
}
