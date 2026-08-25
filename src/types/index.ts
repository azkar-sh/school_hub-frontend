export type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT';

export type AssessmentType = 'QUIZ' | 'EXAM' | 'ASSIGNMENT';

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'GRADED';

export type ParentRelationship = 'FATHER' | 'MOTHER' | 'GUARDIAN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface School {
  id: string;
  name: string;
  createdAt?: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  order: number;
  subTopics?: SubTopic[];
}

export interface SubTopic {
  id: string;
  topicId: string;
  name: string;
  description?: string;
  order: number;
}

export interface Class {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;
  grade: number;
}

export interface QuestionOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  assessmentId: string;
  subTopicId?: string;
  type: QuestionType;
  question: string;
  points: number;
  order: number;
  options?: QuestionOption[];
}

export interface Assessment {
  id: string;
  teachingAssignmentId?: string;
  title: string;
  description?: string;
  type: AssessmentType;
  dueAt?: string;
  createdAt?: string;
  questions?: Question[];
  submissionsCount?: number;
}

export interface AnswerPayload {
  questionId: string;
  answer: string;
}

export interface Submission {
  id: string;
  assessmentId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  status: SubmissionStatus;
  score?: number;
  assessment?: Assessment;
  student?: User;
  answers?: Array<{
    id: string;
    questionId: string;
    answer: string;
    pointsEarned?: number;
    question?: Question;
  }>;
}
