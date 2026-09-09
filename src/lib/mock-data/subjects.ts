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
  /** Teacher names responsible for this subject */
  teachers?: string[];
}

export function getMockSubjects(role: UserRole): MockSubject[] {
  const canEdit = role === "TEACHER";
  return [
    {
      id: "s1",
      name: "Mathematics",
      code: "MATH",
      canEdit,
      teachers: ["Mr. Smith", "Ms. Johnson"],
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
      teachers: ["Dr. Lee"],
      topics: [
        {
          name: "Biology Basics",
          subTopics: ["Cell Structure", "Photosynthesis"],
        },
      ],
    },
  ];
}
