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
