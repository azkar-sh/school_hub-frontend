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
  /** TEACHER only: a class the teacher teaches or is homeroom for */
  isMyClass?: boolean;
  /** TEACHER only: a class the teacher is the homeroom teacher for */
  isHomeroom?: boolean;
}

export function getMockClasses(role: UserRole): MockClass[] {
  if (role === "TEACHER") {
    return [
      {
        id: "c1",
        name: "8A",
        grade: 8,
        academicYear: "2026/2027",
        homeroomTeacher: "Bu Siti (You)",
        studentsCount: 24,
        isMyClass: true,
        isHomeroom: true,
      },
      {
        id: "c2",
        name: "9B",
        grade: 9,
        academicYear: "2026/2027",
        homeroomTeacher: "Pak Bambang",
        studentsCount: 22,
        isMyClass: true,
      },
      {
        id: "c3",
        name: "7A",
        grade: 7,
        academicYear: "2026/2027",
        homeroomTeacher: "Bu Dewi",
        studentsCount: 20,
      },
      {
        id: "c4",
        name: "10C",
        grade: 10,
        academicYear: "2026/2027",
        homeroomTeacher: "Pak Hadi",
        studentsCount: 18,
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
