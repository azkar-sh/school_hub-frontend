import { MockRecentResult } from "./student";

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
