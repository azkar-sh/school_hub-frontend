import { UserRole } from "@/types";

export interface MemberTeachingAssignment {
  id: string;
  subjectName: string;
  subjectCode: string;
  className: string;
  grade: number;
  academicYear: string;
}

export interface MemberHomeroomAssignment {
  className: string;
  grade: number;
  academicYear: string;
}

export interface MemberEnrollment {
  className: string;
  grade: number;
  academicYear: string;
  enrolledAt?: string;
}

export interface MemberLinkedUser {
  id?: string;
  name: string;
  email: string;
  relationship: "FATHER" | "MOTHER" | "GUARDIAN";
  className?: string;
}

export interface MockMember {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName: string;
  createdAt?: string;
  teachingAssignments?: MemberTeachingAssignment[];
  homeroomAssignment?: MemberHomeroomAssignment | null;
  enrollment?: MemberEnrollment | null;
  guardians?: MemberLinkedUser[];
  children?: MemberLinkedUser[];
}

export function getMockMembers(): MockMember[] {
  return [
    {
      id: "member-1",
      userId: "usr-admin-garuda",
      name: "Bu Ratna",
      email: "admin.garuda@learnhub.com",
      role: "SCHOOL_ADMIN",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-01-15T08:00:00Z",
    },
    {
      id: "member-2",
      userId: "usr-teacher-siti",
      name: "Bu Siti",
      email: "teacher1.garuda@learnhub.com",
      role: "TEACHER",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-08-01T09:00:00Z",
      homeroomAssignment: {
        className: "8A",
        grade: 8,
        academicYear: "2024/2025",
      },
      teachingAssignments: [
        {
          id: "ta-1",
          subjectName: "Mathematics",
          subjectCode: "MATH",
          className: "8A",
          grade: 8,
          academicYear: "2024/2025",
        },
        {
          id: "ta-2",
          subjectName: "Mathematics",
          subjectCode: "MATH",
          className: "8B",
          grade: 8,
          academicYear: "2024/2025",
        },
      ],
    },
    {
      id: "member-3",
      userId: "usr-teacher-hendra",
      name: "Pak Hendra",
      email: "teacher2.garuda@learnhub.com",
      role: "TEACHER",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-08-01T09:15:00Z",
      homeroomAssignment: null,
      teachingAssignments: [
        {
          id: "ta-3",
          subjectName: "Science",
          subjectCode: "SCI",
          className: "8A",
          grade: 8,
          academicYear: "2024/2025",
        },
        {
          id: "ta-4",
          subjectName: "Science",
          subjectCode: "SCI",
          className: "8B",
          grade: 8,
          academicYear: "2024/2025",
        },
      ],
    },
    {
      id: "member-4",
      userId: "usr-student-budi",
      name: "Budi Santoso",
      email: "student1.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-15T10:00:00Z",
      enrollment: {
        className: "8A",
        grade: 8,
        academicYear: "2024/2025",
        enrolledAt: "2024-07-15T10:00:00Z",
      },
      guardians: [
        {
          name: "Pak Agus",
          email: "parent1.garuda@learnhub.com",
          relationship: "FATHER",
        },
      ],
    },
    {
      id: "member-5",
      userId: "usr-student-siti",
      name: "Siti Rahma",
      email: "student2.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-15T10:30:00Z",
      enrollment: {
        className: "8A",
        grade: 8,
        academicYear: "2024/2025",
        enrolledAt: "2024-07-15T10:30:00Z",
      },
      guardians: [
        {
          name: "Bu Yuni",
          email: "parent2.garuda@learnhub.com",
          relationship: "MOTHER",
        },
      ],
    },
    {
      id: "member-6",
      userId: "usr-student-dewi",
      name: "Dewi Lestari",
      email: "student3.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-15T11:00:00Z",
      enrollment: {
        className: "8B",
        grade: 8,
        academicYear: "2024/2025",
        enrolledAt: "2024-07-15T11:00:00Z",
      },
    },
    {
      id: "member-7",
      userId: "usr-student-andi",
      name: "Andi Wijaya",
      email: "student4.garuda@learnhub.com",
      role: "STUDENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-16T08:30:00Z",
      enrollment: {
        className: "8B",
        grade: 8,
        academicYear: "2024/2025",
        enrolledAt: "2024-07-16T08:30:00Z",
      },
    },
    {
      id: "member-8",
      userId: "usr-parent-agus",
      name: "Pak Agus",
      email: "parent1.garuda@learnhub.com",
      role: "PARENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-20T14:00:00Z",
      children: [
        {
          name: "Budi Santoso",
          email: "student1.garuda@learnhub.com",
          relationship: "FATHER",
          className: "8A",
        },
      ],
    },
    {
      id: "member-9",
      userId: "usr-parent-yuni",
      name: "Bu Yuni",
      email: "parent2.garuda@learnhub.com",
      role: "PARENT",
      schoolName: "SMA Garuda Hope",
      createdAt: "2024-07-20T14:30:00Z",
      children: [
        {
          name: "Siti Rahma",
          email: "student2.garuda@learnhub.com",
          relationship: "MOTHER",
          className: "8A",
        },
      ],
    },
  ];
}

