import { UserRole } from "@/types";

export interface MockDashboardStats {
  stat1Label: string;
  stat1Value: string;
  stat1Sub: string;
  stat2Label: string;
  stat2Value: string;
  stat2Sub: string;
  stat3Label: string;
  stat3Value: string;
  stat3Sub: string;
  stat4Label: string;
  stat4Value: string;
  stat4Sub: string;
}

export interface MockRecentAssessment {
  id: string;
  title: string;
  type: string;
  subject: string;
  due: string;
  questionsCount: number;
  points: number;
}

export function getMockRecentAssessments(
  role: UserRole,
): MockRecentAssessment[] {
  if (role === "TEACHER") {
    return [
      {
        id: "1",
        title: "Mathematics Quiz 1 - 8A",
        type: "QUIZ",
        subject: "Mathematics",
        due: "Due Aug 30",
        questionsCount: 10,
        points: 100,
      },
      {
        id: "5",
        title: "Science Quiz 1 - 8A",
        type: "QUIZ",
        subject: "Science",
        due: "Due Sep 10",
        questionsCount: 12,
        points: 120,
      },
      {
        id: "4",
        title: "Science Homework 1 - 8A",
        type: "QUIZ",
        subject: "Science",
        due: "Due Sep 1",
        questionsCount: 8,
        points: 80,
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
        due: "Due Today",
        questionsCount: 10,
        points: 100,
      },
      {
        id: "2",
        title: "Science Quiz 1 - 8A",
        type: "EXAM",
        subject: "Science",
        due: "Due in 3 days",
        questionsCount: 15,
        points: 150,
      },
      {
        id: "3",
        title: "Science Homework 1 - 8A",
        type: "ASSIGNMENT",
        subject: "Science",
        due: "Submitted",
        questionsCount: 5,
        points: 50,
      },
    ];
  }

  // PARENT
  return [
    {
      id: "3",
      title: "Science Homework 1 - 8A",
      type: "ASSIGNMENT",
      subject: "Science",
      due: "Submitted Aug 20",
      questionsCount: 5,
      points: 50,
    },
    {
      id: "4",
      title: "Mathematics Quiz 1 - 8A",
      type: "QUIZ",
      subject: "Mathematics",
      due: "Graded — 75%",
      questionsCount: 8,
      points: 80,
    },
    {
      id: "1",
      title: "Mathematics Quiz 1 - 8B",
      type: "QUIZ",
      subject: "Mathematics",
      due: "Due Aug 30",
      questionsCount: 10,
      points: 100,
    },
  ];
}

export function getMockStudentListForTeacher(): { id: string; name: string }[] {
  return [
    { id: "student1", name: "Budi Santoso" },
    { id: "student2", name: "Siti Rahma" },
    { id: "student3", name: "Dewi Lestari" },
    { id: "student4", name: "Andi Wijaya" },
  ];
}
