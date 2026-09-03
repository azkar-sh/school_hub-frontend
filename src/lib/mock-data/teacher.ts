export interface MockTeacherDashboardClass {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
}

export function getMockTeacherDashboardClasses(): MockTeacherDashboardClass[] {
  return [
    {
      id: "c1",
      name: "8A",
      subject: "Mathematics",
      studentCount: 28,
      assessmentCount: 3,
    },
    {
      id: "c2",
      name: "8A",
      subject: "Science",
      studentCount: 28,
      assessmentCount: 2,
    },
    {
      id: "c3",
      name: "8B",
      subject: "Mathematics",
      studentCount: 30,
      assessmentCount: 2,
    },
  ];
}

export interface MockTeacherResultRow {
  id: string;
  student: string;
  assessment: string;
  subject: string;
  class: string;
  score: number;
}

export interface MockTeacherResultsSummary {
  average: number;
  highest: number;
  lowest: number;
}

export function getMockTeacherResults(): MockTeacherResultRow[] {
  return [
    {
      id: "1",
      student: "Budi Santoso",
      assessment: "Mathematics Quiz 1 - 8A",
      subject: "Mathematics",
      class: "8A",
      score: 100,
    },
    {
      id: "2",
      student: "Siti Rahma",
      assessment: "Mathematics Quiz 1 - 8A",
      subject: "Mathematics",
      class: "8A",
      score: 85,
    },
    {
      id: "3",
      student: "Dewi Lestari",
      assessment: "Science Quiz 1 - 8A",
      subject: "Science",
      class: "8A",
      score: 92,
    },
    {
      id: "4",
      student: "Andi Wijaya",
      assessment: "Science Homework 1 - 8A",
      subject: "Science",
      class: "8A",
      score: 60,
    },
    {
      id: "5",
      student: "Budi Santoso",
      assessment: "Mathematics Quiz 1 - 8B",
      subject: "Mathematics",
      class: "8B",
      score: 75,
    },
  ];
}

export function getMockTeacherResultsSummary(
  rows: MockTeacherResultRow[],
): MockTeacherResultsSummary {
  if (rows.length === 0) {
    return { average: 0, highest: 0, lowest: 0 };
  }
  const scores = rows.map((r) => r.score);
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return {
    average: Math.round(sum / scores.length),
    highest: Math.max(...scores),
    lowest: Math.min(...scores),
  };
}

export interface MockTeacherSubjectAssessment {
  assessmentId: string;
  submissionId: string;
  title: string;
  type: "QUIZ" | "EXAM" | "ASSIGNMENT";
  classId: string;
  className: string;
  scorePercentage: number | null;
  submittedAt?: string;
  status: "SUBMITTED" | "GRADED";
}

export interface MockTeacherSubjectStudent {
  studentId: string;
  studentName: string;
  averageScore: number;
  assessmentCount: number;
  assessments: MockTeacherSubjectAssessment[];
}

export interface MockTeacherSubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  averageScore: number;
  studentCount: number;
  students: MockTeacherSubjectStudent[];
}

export function getMockTeacherSubjectResults(): MockTeacherSubjectResult[] {
  return [
    {
      subjectId: "sub-math",
      subjectName: "Mathematics",
      subjectCode: "MATH",
      averageScore: 87,
      studentCount: 2,
      students: [
        {
          studentId: "u-budi",
          studentName: "Budi Santoso",
          averageScore: 88,
          assessmentCount: 2,
          assessments: [
            {
              assessmentId: "1",
              submissionId: "s1",
              title: "Mathematics Quiz 1 - 8A",
              type: "QUIZ",
              classId: "c1",
              className: "8A",
              scorePercentage: 100,
              submittedAt: "2026-08-23",
              status: "GRADED",
            },
            {
              assessmentId: "4",
              submissionId: "s5",
              title: "Mathematics Quiz 1 - 8B",
              type: "QUIZ",
              classId: "c3",
              className: "8B",
              scorePercentage: 75,
              submittedAt: "2026-09-01",
              status: "GRADED",
            },
          ],
        },
        {
          studentId: "u-siti",
          studentName: "Siti Rahma",
          averageScore: 85,
          assessmentCount: 1,
          assessments: [
            {
              assessmentId: "1",
              submissionId: "s2",
              title: "Mathematics Quiz 1 - 8A",
              type: "QUIZ",
              classId: "c1",
              className: "8A",
              scorePercentage: 85,
              submittedAt: "2026-08-23",
              status: "GRADED",
            },
          ],
        },
      ],
    },
    {
      subjectId: "sub-sci",
      subjectName: "Science",
      subjectCode: "SCI",
      averageScore: 76,
      studentCount: 2,
      students: [
        {
          studentId: "u-dewi",
          studentName: "Dewi Lestari",
          averageScore: 92,
          assessmentCount: 1,
          assessments: [
            {
              assessmentId: "2",
              submissionId: "s3",
              title: "Science Quiz 1 - 8A",
              type: "EXAM",
              classId: "c2",
              className: "8A",
              scorePercentage: 92,
              submittedAt: "2026-09-05",
              status: "GRADED",
            },
          ],
        },
        {
          studentId: "u-andi",
          studentName: "Andi Wijaya",
          averageScore: 60,
          assessmentCount: 1,
          assessments: [
            {
              assessmentId: "3",
              submissionId: "s4",
              title: "Science Homework 1 - 8A",
              type: "ASSIGNMENT",
              classId: "c2",
              className: "8A",
              scorePercentage: 60,
              submittedAt: "2026-08-20",
              status: "SUBMITTED",
            },
          ],
        },
      ],
    },
  ];
}
