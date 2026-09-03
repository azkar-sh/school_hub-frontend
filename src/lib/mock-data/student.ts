export interface MockRecentResult {
  id: string;
  assessment: string;
  subject: string;
  score: number;
  date: string;
}

export interface MockStudentClassInfo {
  id: string;
  name: string;
  grade: number;
  homeroomTeacher: string;
  academicYear: string;
}

export function getMockStudentClassInfo(): MockStudentClassInfo {
  return {
    id: "c1",
    name: "8A",
    grade: 8,
    homeroomTeacher: "Bu Siti",
    academicYear: "2026/2027",
  };
}

export function getMockStudentRecentResults(): MockRecentResult[] {
  return [
    {
      id: "1",
      assessment: "Mathematics Quiz 1 - 8B",
      subject: "Mathematics",
      score: 75,
      date: "Aug 23, 2026",
    },
    {
      id: "2",
      assessment: "Science Homework 1 - 8A",
      subject: "Science",
      score: 90,
      date: "Aug 20, 2026",
    },
  ];
}

export interface MockSubjectAssessmentResult {
  id: string;
  title: string;
  type: "QUIZ" | "EXAM" | "ASSIGNMENT";
  scorePercentage: number | null;
  submittedAt?: string;
  status: "SUBMITTED" | "GRADED";
}

export interface MockSubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  averageScore: number;
  assessmentCount: number;
  assessments: MockSubjectAssessmentResult[];
}

export function getMockStudentSubjectResults(): MockSubjectResult[] {
  return [
    {
      subjectId: "sub-math",
      subjectName: "Mathematics",
      subjectCode: "MATH",
      averageScore: 78,
      assessmentCount: 2,
      assessments: [
        {
          id: "4",
          title: "Mathematics Quiz 1 - 8B",
          type: "QUIZ",
          scorePercentage: 75,
          submittedAt: "2026-08-23",
          status: "GRADED",
        },
        {
          id: "6",
          title: "Mathematics Midterm - 8A",
          type: "EXAM",
          scorePercentage: 81,
          submittedAt: "2026-09-02",
          status: "GRADED",
        },
      ],
    },
    {
      subjectId: "sub-sci",
      subjectName: "Science",
      subjectCode: "SCI",
      averageScore: 90,
      assessmentCount: 1,
      assessments: [
        {
          id: "3",
          title: "Science Homework 1 - 8A",
          type: "ASSIGNMENT",
          scorePercentage: 90,
          submittedAt: "2026-08-20",
          status: "SUBMITTED",
        },
      ],
    },
  ];
}
