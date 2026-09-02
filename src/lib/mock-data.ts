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

// ---------------------------------------------------------------------------
// Mock School Admin Dashboard Data
// ---------------------------------------------------------------------------
export interface MockSchoolAdminOverview {
  teachersCount: number;
  studentsCount: number;
  classesCount: number;
  subjectsCount: number;
}

export function getMockSchoolAdminOverview(): MockSchoolAdminOverview {
  return {
    teachersCount: 8,
    studentsCount: 145,
    classesCount: 4,
    subjectsCount: 2,
  };
}

export interface MockSchoolAdminAcademicYear {
  name: string;
  status: "Active" | "Closed";
  classesCount: number;
  studentsCount: number;
}

export function getMockSchoolAdminAcademicYear(): MockSchoolAdminAcademicYear {
  return {
    name: "2026/2027",
    status: "Active",
    classesCount: 4,
    studentsCount: 145,
  };
}

export interface MockRecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
}

export function getMockSchoolAdminRecentActivity(): MockRecentActivity[] {
  return [
    {
      id: "1",
      action: 'Created assessment "Mathematics Quiz 1"',
      user: "Bu Siti",
      time: "2 hours ago",
    },
    {
      id: "2",
      action: "Enrolled student in class 8A",
      user: "Bu Ratna",
      time: "5 hours ago",
    },
    {
      id: "3",
      action: "Submitted Science Homework 1",
      user: "Budi Santoso",
      time: "1 day ago",
    },
    {
      id: "4",
      action: "Created academic year 2026/2027",
      user: "Bu Ratna",
      time: "2 days ago",
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Teacher Dashboard Classes
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock Student Dashboard Data
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock Recent Results (Student & Parent)
// ---------------------------------------------------------------------------
export interface MockRecentResult {
  id: string;
  assessment: string;
  subject: string;
  score: number;
  date: string;
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

// ---------------------------------------------------------------------------
// Mock Parent Dashboard Data
// ---------------------------------------------------------------------------
export interface MockParentChild {
  id: string;
  name: string;
  className: string;
  latestResult: string;
}

export function getMockParentChildren(): MockParentChild[] {
  return [
    {
      id: "student1",
      name: "Budi Santoso",
      className: "8A",
      latestResult: "Math Quiz: 75%",
    },
  ];
}

export function getMockParentRecentResults(): MockRecentResult[] {
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

// ---------------------------------------------------------------------------
// Mock School Members (for /members page)
// ---------------------------------------------------------------------------
export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName: string;
}

export function getMockMembers(): MockMember[] {
  return [
    {
      id: "member-1",
      name: "Bu Ratna",
      email: "admin.garuda@learnhub.com",
      role: "SCHOOL_ADMIN",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-2",
      name: "Bu Siti",
      email: "teacher1.garuda@learnhub.com",
      role: "TEACHER",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-3",
      name: "Pak Hendra",
      email: "teacher2.garuda@learnhub.com",
      role: "TEACHER",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-4",
      name: "Budi Santoso",
      email: "student1.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-5",
      name: "Siti Rahma",
      email: "student2.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-6",
      name: "Dewi Lestari",
      email: "student3.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-7",
      name: "Andi Wijaya",
      email: "student4.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-8",
      name: "Pak Agus",
      email: "parent1.garuda@learnhub.com",
      role: "PARENT",
      schoolName: "SMA Garuda Hope",
    },
    {
      id: "member-9",
      name: "Bu Yuni",
      email: "parent2.garuda@learnhub.com",
      role: "PARENT",
      schoolName: "SMA Garuda Hope",
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Child Detail (for /children/:studentId page)
// ---------------------------------------------------------------------------
export interface MockChildDetail {
  id: string;
  name: string;
  className: string;
  grade: number;
  assessmentCount: number;
  average: number;
}

export function getMockChildDetail(studentId: string): MockChildDetail {
  return {
    id: studentId,
    name: "Budi Santoso",
    className: "8A",
    grade: 8,
    assessmentCount: 4,
    average: 82,
  };
}

export function getMockChildAssessmentResults(
  _studentId: string,
): MockRecentResult[] {
  return [
    {
      id: "1",
      assessment: "Mathematics Quiz 1 - 8A",
      subject: "Mathematics",
      score: 100,
      date: "Aug 25, 2026",
    },
    {
      id: "2",
      assessment: "Mathematics Quiz 1 - 8B",
      subject: "Mathematics",
      score: 75,
      date: "Aug 23, 2026",
    },
    {
      id: "3",
      assessment: "Science Homework 1 - 8A",
      subject: "Science",
      score: 90,
      date: "Aug 20, 2026",
    },
    {
      id: "4",
      assessment: "Science Quiz 1 - 8A",
      subject: "Science",
      score: 64,
      date: "Aug 18, 2026",
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Parent Children List (expanded with assessment count & average)
// ---------------------------------------------------------------------------
export interface MockParentChildDetail {
  id: string;
  name: string;
  className: string;
  assessmentCount: number;
  average: number;
}

export function getMockParentChildrenDetail(): MockParentChildDetail[] {
  return [
    {
      id: "student1",
      name: "Budi Santoso",
      className: "8A",
      assessmentCount: 4,
      average: 82,
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock Teacher Results (for /results page - teacher view)
// ---------------------------------------------------------------------------
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
