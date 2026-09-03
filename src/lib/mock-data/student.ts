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
