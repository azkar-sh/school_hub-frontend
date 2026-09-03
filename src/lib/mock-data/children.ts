import { MockRecentResult } from "./student";

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
