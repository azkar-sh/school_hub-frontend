import axios from "axios";
import {
  AcademicYear,
  AddSchoolMemberDto,
  Assessment,
  AssignHomeroomDto,
  AuthResponse,
  Class,
  CreateAcademicYearDto,
  CreateAssessmentDto,
  CreateClassDto,
  CreateParentStudentDto,
  CreateQuestionDto,
  CreateSchoolDto,
  CreateSubjectDto,
  CreateSubTopicDto,
  CreateTeachingAssignmentDto,
  CreateTopicDto,
  EnrollStudentDto,
  GradeSubmissionDto,
  ParentStudent,
  ParentChildLink,
  Question,
  SaveAnswersDto,
  School,
  SchoolMember,
  StartSubmissionDto,
  Subject,
  Submission,
  SubTopic,
  TeachingAssignment,
  Topic,
  UpdateQuestionDto,
  User,
} from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("school_hub_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to unwrap NestJS ResponseTransformInterceptor envelope
apiClient.interceptors.response.use(
  (response) => {
    // If response matches NestJS transform interceptor structure { success: true, data: T }
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(
      new Error(Array.isArray(message) ? message.join(", ") : message),
    );
  },
);

// Auth API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => apiClient.post<AuthResponse>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/login", data),
  getMe: () =>
    apiClient.get<{ userId: string; email: string; role: string }>("/auth/me"),
};

// Users API
export const usersApi = {
  getMe: () => apiClient.get<User>("/users/me"),
  findAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<User[]>("/users", { params }),
  findOne: (id: string) => apiClient.get<User>(`/users/${id}`),
};

// Schools API
export const schoolsApi = {
  create: (data: CreateSchoolDto) => apiClient.post<School>("/schools", data),
  findAll: () => apiClient.get<School[]>("/schools"),
  findOne: (id: string) => apiClient.get<School>(`/schools/${id}`),
  addMember: (schoolId: string, data: AddSchoolMemberDto) =>
    apiClient.post<SchoolMember>(`/schools/${schoolId}/members`, data),
  getMembers: (schoolId: string) =>
    apiClient.get<SchoolMember[]>(`/schools/${schoolId}/members`),
};

// Academic Years API
export const academicYearsApi = {
  create: (data: CreateAcademicYearDto) =>
    apiClient.post<AcademicYear>("/academic-years", data),
  findBySchool: (schoolId: string) =>
    apiClient.get<AcademicYear[]>("/academic-years", { params: { schoolId } }),
  findOne: (id: string) => apiClient.get<AcademicYear>(`/academic-years/${id}`),
};

// Subjects API
export const subjectsApi = {
  createSubject: (data: CreateSubjectDto) =>
    apiClient.post<Subject>("/subjects", data),
  findSubjectsBySchool: (schoolId: string) =>
    apiClient.get<Subject[]>("/subjects", { params: { schoolId } }),
  updateSubject: (id: string, data: Partial<CreateSubjectDto>) =>
    apiClient.put<Subject>(`/subjects/${id}`, data),
  deleteSubject: (id: string) => apiClient.delete(`/subjects/${id}`),
  findSubjectById: (id: string) => apiClient.get<Subject>(`/subjects/${id}`),

  createTopic: (data: CreateTopicDto) =>
    apiClient.post<Topic>("/subjects/topics", data),
  updateTopic: (id: string, data: Partial<CreateTopicDto>) =>
    apiClient.put<Topic>(`/subjects/topics/${id}`, data),
  findTopicsBySubject: (subjectId: string) =>
    apiClient.get<Topic[]>(`/subjects/${subjectId}/topics`),

  createSubTopic: (data: CreateSubTopicDto) =>
    apiClient.post<SubTopic>("/subjects/topics/sub-topics", data),
  updateSubTopic: (id: string, data: Partial<CreateSubTopicDto>) =>
    apiClient.put<SubTopic>(`/subjects/topics/sub-topics/${id}`, data),
  findSubTopicsByTopic: (topicId: string) =>
    apiClient.get<SubTopic[]>(`/subjects/topics/${topicId}/sub-topics`),
};

// Classes API
export const classesApi = {
  create: (data: CreateClassDto) => apiClient.post<Class>("/classes", data),
  findBySchool: (schoolId: string, academicYearId?: string) =>
    apiClient.get<Class[]>("/classes", {
      params: { schoolId, academicYearId },
    }),
  findOne: (id: string) => apiClient.get<Class>(`/classes/${id}`),
  enrollStudent: (classId: string, data: EnrollStudentDto) =>
    apiClient.post(`/classes/${classId}/enroll`, data),
  assignHomeroom: (classId: string, data: AssignHomeroomDto) =>
    apiClient.post(`/classes/${classId}/assign-homeroom`, data),
  getRegisteredStudents: (classId: string) =>
    apiClient.get<User[]>(`/classes/${classId}/registered-students`),
};

// Teaching Assignments API
export const teachingAssignmentsApi = {
  create: (data: CreateTeachingAssignmentDto) =>
    apiClient.post<TeachingAssignment>("/teaching-assignments", data),
  findByTeacher: (teacherId?: string) =>
    apiClient.get<TeachingAssignment[]>("/teaching-assignments", {
      params: teacherId ? { teacherId } : undefined,
    }),
  findBySchool: (schoolId: string) =>
    apiClient.get<TeachingAssignment[]>("/teaching-assignments/by-school", {
      params: { schoolId },
    }),
  findOne: (id: string) =>
    apiClient.get<TeachingAssignment>(`/teaching-assignments/${id}`),
};

// Assessments API
export const assessmentsApi = {
  create: (data: CreateAssessmentDto) =>
    apiClient.post<Assessment>("/assessments", data),
  addQuestion: (id: string, data: CreateQuestionDto) =>
    apiClient.post<Question>(`/assessments/${id}/questions`, data),
  updateQuestion: (id: string, questionId: string, data: UpdateQuestionDto) =>
    apiClient.put<Question>(`/assessments/${id}/questions/${questionId}`, data),
  deleteQuestion: (id: string, questionId: string) =>
    apiClient.delete<{ id: string; deleted: boolean }>(
      `/assessments/${id}/questions/${questionId}`,
    ),
  // subjectId/type accept single or array; repeat serialization matches Nest implicitConversion
  findForTeacher: (params?: { page?: number; limit?: number; search?: string; subjectId?: string | string[]; type?: string | string[] }) =>
    apiClient.get<Assessment[]>("/assessments/teacher", { params, paramsSerializer: { indexes: null } }),
  findForStudent: (params?: { page?: number; limit?: number; search?: string; subjectId?: string | string[]; type?: string | string[] }) =>
    apiClient.get<{ assessments: Assessment[]; meta: { page: number; limit: number; total: number; totalPages: number } }>("/assessments/student", { params, paramsSerializer: { indexes: null } }),
  findOne: (id: string) => apiClient.get<Assessment>(`/assessments/${id}`),
  findSubjectsForStudent: () => apiClient.get<Subject[]>("/assessments/student/subjects"),
  // Filtered sub-topics: topic-scoped if assessment has topicId,
  // otherwise all sub-topics under teaching assignment's subject
  getSubTopics: (id: string) =>
    apiClient.get<SubTopic[]>(`/assessments/${id}/sub-topics`),
};

// Submissions API
export const submissionsApi = {
  start: (data: StartSubmissionDto) =>
    apiClient.post<Submission>("/submissions/start", data),
  saveAnswers: (id: string, data: SaveAnswersDto) =>
    apiClient.post<Submission>(`/submissions/${id}/answers`, data),
  submit: (id: string, data?: SaveAnswersDto) =>
    apiClient.post<Submission>(`/submissions/${id}/submit`, data),
  grade: (id: string, data: GradeSubmissionDto) =>
    apiClient.patch<Submission>(`/submissions/${id}/grade`, data),
  autoGrade: (id: string) =>
    apiClient.post<Submission>(`/submissions/${id}/auto-grade`),
  findAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | string[];
    subjectId?: string | string[];
    classId?: string | string[];
  }) =>
    apiClient.get<{
      submissions: Submission[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }>("/submissions", { params, paramsSerializer: { indexes: null } }),
  findOne: (id: string) => apiClient.get<Submission>(`/submissions/${id}`),
};

// Parent-Students API
export const parentStudentsApi = {
  link: (data: CreateParentStudentDto) =>
    apiClient.post<ParentStudent>("/parent-students", data),
  getChildren: (parentId?: string) =>
    apiClient.get<ParentChildLink[]>("/parent-students/children", {
      params: parentId ? { parentId } : undefined,
    }),
  getParents: (studentId: string) =>
    apiClient.get<User[]>(`/parent-students/parents/${studentId}`),
};
