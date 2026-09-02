/**
 * Centralized role-aware mock data for preview/demo mode.
 * All mock data functions return content appropriate for the given role.
 */
import { UserRole } from "@/types";

// ---------------------------------------------------------------------------
// Mock Assessments
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock Submissions
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock Classes
// ---------------------------------------------------------------------------
export interface MockClass {
  id: string;
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacher: string;
  studentsCount: number;
  /** Present for STUDENT/PARENT to show which class the child belongs to */
  isCurrentStudentClass?: boolean;
}

export function getMockClasses(role: UserRole): MockClass[] {
  if (role === "TEACHER") {
    return [
      {
        id: "c1",
        name: "8A",
        grade: 8,
        academicYear: "2026/2027",
        homeroomTeacher: "Bu Siti",
        studentsCount: 2,
      },
      // { id: 'c2', name: 'Grade 10-B', grade: 10, academicYear: '2025/2026', homeroomTeacher: 'Dr. Robert Vance', studentsCount: 30 },
      // { id: 'c3', name: 'Grade 11-A', grade: 11, academicYear: '2025/2026', homeroomTeacher: 'Ms. Elena Rostova', studentsCount: 28 },
      // { id: 'c4', name: 'Grade 12-Science', grade: 12, academicYear: '2025/2026', homeroomTeacher: 'Mr. David Miller', studentsCount: 25 },
    ];
  }

  if (role === "STUDENT") {
    return [
      {
        id: "c1",
        name: "8A",
        grade: 8,
        academicYear: "2026/2027",
        homeroomTeacher: "Bu Siti",
        studentsCount: 2,
        isCurrentStudentClass: true,
      },
    ];
  }

  // PARENT — shows only their child's class
  return [
    {
      id: "c1",
      name: "8A (Budi Santoso)",
      grade: 8,
      academicYear: "2026/2027",
      homeroomTeacher: "Bu Siti",
      studentsCount: 2,
      isCurrentStudentClass: true,
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Subjects
// ---------------------------------------------------------------------------
export interface MockSubjectTopic {
  name: string;
  subTopics: string[];
}

export interface MockSubject {
  id: string;
  name: string;
  code: string;
  topics: MockSubjectTopic[];
  /** Teacher-only: can create/edit topics */
  canEdit?: boolean;
}

export function getMockSubjects(role: UserRole): MockSubject[] {
  const canEdit = role === "TEACHER";
  return [
    {
      id: "s1",
      name: "Mathematics",
      code: "MATH",
      canEdit,
      topics: [
        {
          name: "Algebra",
          subTopics: ["Linear Equations", "Quadratic Equations"],
        },
      ],
    },
    {
      id: "s2",
      name: "Science",
      code: "SCI",
      canEdit,
      topics: [
        {
          name: "Biology Basics",
          subTopics: ["Cell Structure", "Photosynthesis"],
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Dashboard Quick Stats
// ---------------------------------------------------------------------------
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
