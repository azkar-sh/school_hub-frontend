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
