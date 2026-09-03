import { UserRole } from "@/types";

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
