import { UserRole } from "@/types";

export interface MockAssessment {
  id: string;
  title: string;
  type: "QUIZ" | "EXAM" | "ASSIGNMENT";
  subject: string;
  due: string;
  questionsCount: number;
  points: number;
  /** Student-specific status */
  status: "AVAILABLE" | "SUBMITTED" | "GRADED";
  /** Teacher-specific: number of student submissions received */
  submissionsCount?: number;
  /** Teacher-specific: average score across submissions */
  avgScore?: number;
}

export function getMockAssessments(role: UserRole): MockAssessment[] {
  if (role === "TEACHER") {
    return [
      {
        id: "1",
        title: "Mathematics Quiz 1 - 8A",
        type: "QUIZ",
        subject: "Mathematics",
        due: "2026-08-30",
        questionsCount: 10,
        points: 100,
        status: "AVAILABLE",
        submissionsCount: 28,
        avgScore: 86,
      },
      {
        id: "2",
        title: "Science Quiz 1 - 8A",
        type: "EXAM",
        subject: "Science",
        due: "2026-09-05",
        questionsCount: 15,
        points: 150,
        status: "AVAILABLE",
        submissionsCount: 12,
        avgScore: 79,
      },
      {
        id: "3",
        title: "Science Homework 1 - 8A",
        type: "ASSIGNMENT",
        subject: "Science",
        due: "2026-08-20",
        questionsCount: 5,
        points: 50,
        status: "AVAILABLE",
        submissionsCount: 32,
        avgScore: 91,
      },
      {
        id: "4",
        title: "Mathematics Quiz 1 - 8B",
        type: "QUIZ",
        subject: "Mathematics",
        due: "2026-09-01",
        questionsCount: 8,
        points: 80,
        status: "AVAILABLE",
        submissionsCount: 4,
        avgScore: 73,
      },
      {
        id: "5",
        title: "Science Homework 1 - 8B",
        type: "ASSIGNMENT",
        subject: "Science",
        due: "2026-09-10",
        questionsCount: 12,
        points: 120,
        status: "AVAILABLE",
        submissionsCount: 0,
      },
    ];
  }

  if (role === "STUDENT") {
    return [
      {
        id: "1",
        title: "Mathematics Quiz 1 - 8A",
        type: "QUIZ",
        subject: "Mathematics",
        due: "2026-08-30",
        questionsCount: 10,
        points: 100,
        status: "AVAILABLE",
      },
      {
        id: "2",
        title: "Science Quiz 1 - 8A",
        type: "EXAM",
        subject: "Science",
        due: "2026-09-05",
        questionsCount: 15,
        points: 150,
        status: "AVAILABLE",
      },
      {
        id: "3",
        title: "Science Homework 1 - 8A",
        type: "ASSIGNMENT",
        subject: "Science",
        due: "2026-08-20",
        questionsCount: 5,
        points: 50,
        status: "SUBMITTED",
      },
      {
        id: "4",
        title: "Mathematics Quiz 1 - 8B",
        type: "QUIZ",
        subject: "Mathematics",
        due: "2026-09-01",
        questionsCount: 8,
        points: 80,
        status: "GRADED",
      },
    ];
  }

  // PARENT — child's assessments (read-only)
  return [
    {
      id: "3",
      title: "Science Homework 1 - 8A",
      type: "ASSIGNMENT",
      subject: "Science",
      due: "2026-08-20",
      questionsCount: 5,
      points: 50,
      status: "SUBMITTED",
    },
    {
      id: "4",
      title: "Mathematics Quiz 1 - 8B",
      type: "QUIZ",
      subject: "Mathematics",
      due: "2026-09-01",
      questionsCount: 8,
      points: 80,
      status: "GRADED",
    },
    {
      id: "1",
      title: "Mathematics Quiz 1 - 8A",
      type: "QUIZ",
      subject: "Mathematics",
      due: "2026-08-30",
      questionsCount: 10,
      points: 100,
      status: "AVAILABLE",
    },
  ];
}
