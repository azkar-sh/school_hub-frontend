import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: yup
    .string()
    .oneOf(
      ["TEACHER", "STUDENT", "PARENT", "SCHOOL_ADMIN"],
      "Please select a valid role",
    )
    .required("Role selection is required"),
});

export const schoolSchema = yup.object().shape({
  name: yup
    .string()
    .required("School name is required")
    .min(2, "School name must be at least 2 characters"),
});

export const addMemberSchema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
});

export const academicYearSchema = yup.object().shape({
  schoolId: yup.string().required("School selection is required"),
  name: yup
    .string()
    .required("Academic year name is required (e.g., 2026/2027)"),
  startsAt: yup.string().required("Start date is required"),
  endsAt: yup.string().required("End date is required"),
});

export const subjectSchema = yup.object().shape({
  schoolId: yup.string().required("School selection is required"),
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required (e.g., MATH)"),
});

export const topicSchema = yup.object().shape({
  subjectId: yup.string().required("Subject selection is required"),
  name: yup.string().required("Topic name is required"),
  description: yup.string().optional(),
  order: yup.number().optional().default(0),
});

export const subTopicSchema = yup.object().shape({
  topicId: yup.string().required("Topic selection is required"),
  name: yup.string().required("Sub-topic name is required"),
  description: yup.string().optional(),
  order: yup.number().optional().default(0),
});

export const classSchema = yup.object().shape({
  schoolId: yup.string().required("School selection is required"),
  academicYearId: yup.string().required("Academic year selection is required"),
  name: yup.string().required("Class name is required (e.g., 8A)"),
  grade: yup
    .number()
    .typeError("Grade must be a number")
    .required("Grade number is required")
    .min(1, "Grade must be at least 1"),
});

export const enrollStudentSchema = yup.object().shape({
  studentId: yup.string().required("Student selection is required"),
  academicYearId: yup.string().required("Academic year selection is required"),
});

export const assignHomeroomSchema = yup.object().shape({
  teacherId: yup.string().required("Teacher selection is required"),
  academicYearId: yup.string().required("Academic year selection is required"),
});

export const teachingAssignmentSchema = yup.object().shape({
  teacherId: yup.string().required("Teacher is required"),
  subjectId: yup.string().required("Subject is required"),
  classId: yup.string().required("Class is required"),
  academicYearId: yup.string().required("Academic year is required"),
});

export const assessmentSchema = yup.object().shape({
  teachingAssignmentId: yup
    .string()
    .required("Teaching assignment is required"),
  title: yup
    .string()
    .required("Assessment title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup.string().optional(),
  type: yup
    .string()
    .oneOf(["QUIZ", "EXAM", "ASSIGNMENT"])
    .required("Assessment type is required"),
  dueAt: yup.string().optional(),
  topicId: yup
    .string()
    .transform((value) => (value === "" || value === null ? undefined : value))
    .optional(),
});

export const questionSchema = yup.object().shape({
  subTopicId: yup.string().required("Sub-topic selection is required"),
  question: yup
    .string()
    .required("Question text is required")
    .min(5, "Question must be at least 5 characters"),
  type: yup
    .string()
    .oneOf(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"])
    .required("Question type is required"),
  points: yup
    .number()
    .typeError("Points must be a number")
    .required("Points are required")
    .min(1, "Points must be at least 1"),
});

export const parentStudentSchema = yup.object().shape({
  parentId: yup.string().required("Parent user selection is required"),
  studentId: yup.string().required("Student user selection is required"),
  relationship: yup
    .string()
    .oneOf(["FATHER", "MOTHER", "GUARDIAN"])
    .required("Relationship type is required"),
});
