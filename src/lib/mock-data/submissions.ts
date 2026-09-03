import { UserRole } from "@/types";

export interface MockSubmission {
  id: string;
  studentName: string;
  assessmentTitle: string;
  subject: string;
  score: number | null;
  submittedAt: string;
  status: "SUBMITTED" | "GRADED";
}

export function getMockSubmissions(role: UserRole): MockSubmission[] {
  if (role === "TEACHER") {
    // Teachers see all students' submissions
    return [
      {
        id: "sub-1",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 100,
        submittedAt: "2026-08-25 14:30",
        status: "GRADED",
      },
      {
        id: "sub-2",
        studentName: "Siti Rahma",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 85,
        submittedAt: "2026-08-25 13:15",
        status: "GRADED",
      },
      {
        id: "sub-3",
        studentName: "Dewi Lestari",
        assessmentTitle: "Science Quiz 1 - 8A",
        subject: "Science",
        score: 92,
        submittedAt: "2026-08-24 16:45",
        status: "GRADED",
      },
      {
        id: "sub-4",
        studentName: "Andi Wijaya",
        assessmentTitle: "Science Homework 1 - 8A",
        subject: "Science",
        score: null,
        submittedAt: "2026-08-25 11:20",
        status: "SUBMITTED",
      },
      {
        id: "sub-5",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8B",
        subject: "Mathematics",
        score: 75,
        submittedAt: "2026-08-23 09:00",
        status: "GRADED",
      },
    ];
  }

  if (role === "STUDENT") {
    // Students see only their own submission history
    return [
      {
        id: "sub-1",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 100,
        submittedAt: "2026-08-25 14:30",
        status: "GRADED",
      },
      {
        id: "sub-4",
        studentName: "Budi Santoso",
        assessmentTitle: "Science Homework 1 - 8A",
        subject: "Science",
        score: null,
        submittedAt: "2026-08-25 11:20",
        status: "SUBMITTED",
      },
      {
        id: "sub-5",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8B",
        subject: "Mathematics",
        score: 75,
        submittedAt: "2026-08-23 09:00",
        status: "GRADED",
      },
    ];
  }

  // PARENT — child's submissions
  return [
    {
      id: "sub-1",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Mathematics Quiz 1 - 8A",
      subject: "Mathematics",
      score: 100,
      submittedAt: "2026-08-25 14:30",
      status: "GRADED",
    },
    {
      id: "sub-4",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Science Homework 1 - 8A",
      subject: "Science",
      score: null,
      submittedAt: "2026-08-25 11:20",
      status: "SUBMITTED",
    },
    {
      id: "sub-5",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Mathematics Quiz 1 - 8B",
      subject: "Mathematics",
      score: 75,
      submittedAt: "2026-08-23 09:00",
      status: "GRADED",
    },
  ];
}
