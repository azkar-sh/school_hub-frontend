/**
 * Shared result-grouping helpers used by both the Results page (parent view)
 * and the Children pages. Kept in `lib` so app-level hooks can import it
 * without a layering inversion.
 */

export interface LiveSubmissionAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  teachingAssignment?: {
    subject?: { id: string; name: string; code: string };
    class?: { id: string; name: string };
  };
}

export interface LiveSubmission {
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

export function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

/**
 * Group a single student's submissions into subject buckets, computing the
 * average score per subject. Only SUBMITTED/GRADED attempts are counted.
 */
export function groupSubmissionsBySubject(
  submissions: LiveSubmission[],
): StudentSubjectResult[] {
  const graded = submissions.filter(
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
}
