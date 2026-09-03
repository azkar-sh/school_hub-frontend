import { UserRole } from "@/types";

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
