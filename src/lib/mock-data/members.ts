import { UserRole } from "@/types";

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
