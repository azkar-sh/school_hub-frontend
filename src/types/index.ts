export type UserRole = "TEACHER" | "STUDENT" | "PARENT" | "SCHOOL_ADMIN";

export type AssessmentType = "QUIZ" | "EXAM" | "ASSIGNMENT";

export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

export type SubmissionStatus = "DRAFT" | "SUBMITTED" | "GRADED";

export type ParentRelationship = "FATHER" | "MOTHER" | "GUARDIAN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  schoolMemberships?: SchoolMember[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface School {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  members?: SchoolMember[];
  academicYears?: AcademicYear[];
  subjects?: Subject[];
  classes?: Class[];
}

export interface SchoolMember {
  id: string;
  schoolId: string;
  userId: string;
  createdAt?: string;
  school?: School;
  user?: User;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  school?: School;
  classes?: Class[];
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  school?: School;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  order: number;
  createdAt?: string;
  subject?: Subject;
  subTopics?: SubTopic[];
}

export interface SubTopic {
  id: string;
  topicId: string;
  name: string;
  description?: string;
  order: number;
  createdAt?: string;
  topic?: Topic;
  questions?: Question[];
}

export interface Class {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;
  grade: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  school?: School;
  academicYear?: AcademicYear;
  enrollments?: Enrollment[];
  teachingAssignments?: TeachingAssignment[];
  homeroomAssignments?: HomeroomAssignment[];
  _count?: { enrollments?: number; teachingAssignments?: number };
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  enrolledAt?: string;
  student?: User;
  class?: Class;
  academicYear?: AcademicYear;
}

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  teacher?: User;
  subject?: Subject;
  class?: Class;
  academicYear?: AcademicYear;
  assessments?: Assessment[];
}

export interface HomeroomAssignment {
  id: string;
  teacherId: string;
  classId: string;
  academicYearId: string;
  createdAt?: string;
  teacher?: User;
  class?: Class;
  academicYear?: AcademicYear;
}

export interface ParentStudent {
  id: string;
  parentId: string;
  studentId: string;
  relationship: ParentRelationship;
  createdAt?: string;
  parent?: User;
  student?: User;
}

/**
 * Shape returned by `GET /parent-students/children` — a parent's ward plus
 * their class enrollments (with grade info) for display on the Children pages.
 */
export interface ParentChildLink {
  relationship: ParentRelationship;
  student: {
    id: string;
    name: string;
    email: string;
    enrollments?: Array<{
      id: string;
      classId: string;
      academicYearId: string;
      class?: { id: string; name: string; grade: number };
      academicYear?: { id: string; name: string };
    }>;
  };
}

export interface QuestionOption {
  id?: string;
  questionId?: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  assessmentId: string;
  subTopicId?: string;
  type: QuestionType;
  question: string;
  points: number;
  order: number;
  createdAt?: string;
  subTopic?: SubTopic;
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
  updatedAt?: string;
  teachingAssignment?: TeachingAssignment;
  questions?: Question[];
  submissions?: Submission[];
  submissionsCount?: number;
  // Prisma _count aggregate - avoids loading full relations
  // { questions: number of questions, submissions: number of attempts }
  _count?: { questions?: number; submissions?: number };
}

export interface Answer {
  id: string;
  submissionId: string;
  questionId: string;
  answer: string;
  pointsEarned?: number;
  question?: Question;
}

export interface Submission {
  id: string;
  assessmentId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  status: SubmissionStatus;
  score?: number | string;
  scorePercentage?: number | null;
  assessment?: Assessment;
  student?: User;
  answers?: Answer[];
}

// DTO Payloads
export interface CreateSchoolDto {
  name: string;
}

export interface AddSchoolMemberDto {
  userId: string;
}

export interface CreateAcademicYearDto {
  schoolId: string;
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateSubjectDto {
  schoolId: string;
  name: string;
  code: string;
}

export interface CreateTopicDto {
  subjectId: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CreateSubTopicDto {
  topicId: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CreateClassDto {
  schoolId: string;
  academicYearId: string;
  name: string;
  grade: number;
}

export interface EnrollStudentDto {
  studentId: string;
  academicYearId: string;
}

export interface AssignHomeroomDto {
  teacherId: string;
  academicYearId: string;
}

export interface CreateTeachingAssignmentDto {
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
}

export interface CreateQuestionDto {
  subTopicId: string;
  type: QuestionType;
  question: string;
  points?: number;
  order?: number;
  options?: Array<{ text: string; isCorrect?: boolean }>;
}

export interface UpdateQuestionDto {
  subTopicId?: string;
  type?: QuestionType;
  question?: string;
  points?: number;
  order?: number;
  options?: Array<{ text: string; isCorrect?: boolean }>;
}

export interface CreateAssessmentDto {
  teachingAssignmentId: string;
  title: string;
  description?: string;
  type: AssessmentType;
  dueAt?: string;
  questions?: CreateQuestionDto[];
}

export interface StartSubmissionDto {
  assessmentId: string;
}

export interface SingleAnswerDto {
  questionId: string;
  answer: string;
}

export interface SaveAnswersDto {
  answers: SingleAnswerDto[];
}

export interface GradeAnswerDto {
  answerId: string;
  pointsEarned: number;
}

export interface GradeSubmissionDto {
  grades: GradeAnswerDto[];
}

export interface CreateParentStudentDto {
  parentId: string;
  studentId: string;
  relationship: ParentRelationship;
}
