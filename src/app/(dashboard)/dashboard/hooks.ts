import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import {
  getMockRecentAssessments,
  getMockSchoolAdminOverview,
  getMockSchoolAdminAcademicYear,
  getMockSchoolAdminRecentActivity,
  getMockTeacherDashboardClasses,
  getMockStudentClassInfo,
  getMockStudentRecentResults,
  getMockParentChildren,
  getMockParentRecentResults,
} from "@/lib/mock-data";
import {
  apiClient,
  classesApi,
  academicYearsApi,
  subjectsApi,
  schoolsApi,
  teachingAssignmentsApi,
  submissionsApi,
  parentStudentsApi,
} from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { useTranslations } from "next-intl";

export interface DisplayAssessment {
  id: string;
  title: string;
  type: string;
  subject?: string;
  due: string;
  questionsCount: number;
  points: number;
}

interface LiveSubject {
  id: string;
  name: string;
  code: string;
}

interface LiveClass {
  id: string;
  name: string;
  grade: number;
  academicYearId: string;
  academicYear?: { id: string; name: string };
  _count?: { enrollments: number; teachingAssignments: number };
  enrollments?: { student: { id: string; name: string } }[];
  homeroomAssignments?: { teacher: { id: string; name: string } }[];
}

interface LiveAcademicYear {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
  _count?: { classes: number; teachingAssignments: number; enrollments: number };
}

interface LiveTeachingAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
  subject?: LiveSubject;
  class?: { id: string; name: string; grade: number };
  academicYear?: { id: string; name: string };
  _count?: { assessments: number };
}

export interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  teachingAssignment?: {
    subject?: LiveSubject;
    class?: { id: string; name: string };
    teacher?: { id: string; name: string };
  };
  questions?: unknown[];
  submissions?: {
    id: string;
    status: string;
    score?: number | string | null;
    submittedAt?: string;
  }[];
  _count?: { questions: number; submissions: number };
}

interface LiveSubmission {
  id: string;
  status: string;
  score?: number | string | null;
  scorePercentage?: number | null;
  submittedAt?: string | null;
  startedAt: string;
  student?: { id: string; name: string };
  assessment?: {
    id: string;
    title: string;
    type: string;
    teachingAssignment?: { subject?: LiveSubject; class?: { id: string; name: string } };
  };
}

interface LiveSchoolMember {
  id: string;
  user?: { id: string; name: string; role: string };
}

interface LiveParentChild {
  relationship: string;
  student: {
    id: string;
    name: string;
    email: string;
    enrollments?: {
      class?: { id: string; name: string; grade: number };
      academicYear?: { id: string; name: string };
    }[];
  };
}

function timeAgo(dateStr: string | null | undefined, t: (key: string, values?: Record<string, string | number | Date>) => string): string {
  if (!dateStr) return t("recently");
  const ms = new Date(dateStr).getTime();
  if (Number.isNaN(ms)) return t("recently");
  const diff = Math.max(0, Date.now() - ms);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minutesAgo", { mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t("hoursAgo", { hrs });
  const days = Math.floor(hrs / 24);
  if (days < 7) return t("daysAgo", { days });
  return new Date(dateStr).toLocaleDateString();
}

export function useDashboardPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;
  const tHooks = useTranslations("Dashboard.hooks");
  const { selectedSchoolId } = useSchoolSelection();

  const isAdmin = currentRole === "SCHOOL_ADMIN";
  const isTeacher = currentRole === "TEACHER";
  const isStudent = currentRole === "STUDENT";
  const isParent = currentRole === "PARENT";
  const goLive = !isDemoMode && !!selectedSchoolId;

  // ------------------------------------------------------------------
  // Academic years (shared by admin / teacher / student to pick the
  // active term for all term-scoped queries).
  // ------------------------------------------------------------------
  const { data: academicYearsData } = useFetchData<LiveAcademicYear[]>(
    () =>
      academicYearsApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    goLive && (isAdmin || isTeacher || isStudent),
  );

  const activeAcademicYear = React.useMemo<LiveAcademicYear | null>(() => {
    const ays = academicYearsData ?? [];
    if (ays.length === 0) return null;
    return ays.find((a) => a.isActive) ?? ays[0];
  }, [academicYearsData]);
  const activeAyId = activeAcademicYear?.id ?? "";

  // ------------------------------------------------------------------
  // Assessments — teacher & student
  // ------------------------------------------------------------------
  const teacherAssessmentsEndpoint = isTeacher ? "/assessments/teacher" : null;
  const studentAssessmentsEndpoint = isStudent ? "/assessments/student" : null;

  const {
    data: teacherAssessmentsData,
    isLoading: isLoadingTeacherAssessments,
    error: teacherAssessmentsError,
  } = useFetchData<LiveAssessment[]>(
    () =>
      apiClient
        .get<LiveAssessment[]>(teacherAssessmentsEndpoint!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    !isDemoMode && !!teacherAssessmentsEndpoint,
  );
  const teacherAssessments = React.useMemo(
    () => teacherAssessmentsData ?? [],
    [teacherAssessmentsData],
  );

  const {
    data: studentAssessmentsData,
    isLoading: isLoadingStudentAssessments,
    error: studentAssessmentsError,
  } = useFetchData<LiveAssessment[]>(
    () =>
      apiClient
        .get<LiveAssessment[]>(studentAssessmentsEndpoint!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    !isDemoMode && !!studentAssessmentsEndpoint,
  );
  const studentAssessments = React.useMemo(
    () => studentAssessmentsData ?? [],
    [studentAssessmentsData],
  );

  // ------------------------------------------------------------------
  // Submissions — role-aware (teacher sees their assessments', student
  // sees their own, parent sees their wards', admin sees all).
  // ------------------------------------------------------------------
  const { data: submissionsData, isLoading: isLoadingSubmissions } =
    useFetchData<LiveSubmission[]>(
      () =>
        submissionsApi
          .findAll()
          .then((res) => (Array.isArray(res.data) ? res.data : [])),
      [currentRole],
      !isDemoMode && (isTeacher || isStudent || isParent || isAdmin),
    );
  const submissions = React.useMemo(
    () => submissionsData ?? [],
    [submissionsData],
  );

  // ------------------------------------------------------------------
  // Teaching assignments — teacher (for "My Classes")
  // ------------------------------------------------------------------
  const { data: teachingAssignmentsData, isLoading: isLoadingTeachingAssignments } =
    useFetchData<LiveTeachingAssignment[]>(
      () =>
        teachingAssignmentsApi
          .findByTeacher()
          .then((res) => (Array.isArray(res.data) ? res.data : [])),
      [currentRole],
      !isDemoMode && isTeacher,
    );

  // ------------------------------------------------------------------
  // Classes — admin (overview count), teacher (student counts per
  // class), student (their homeroom class).
  // ------------------------------------------------------------------
  const { data: roleClassesData, isLoading: isLoadingRoleClasses } =
    useFetchData<LiveClass[]>(
      () =>
        classesApi
          .findBySchool(selectedSchoolId, activeAyId)
          .then((res) =>
            (Array.isArray(res.data) ? res.data : []) as unknown as LiveClass[],
          ),
      [selectedSchoolId, activeAyId],
      goLive && !!activeAyId && (isAdmin || isTeacher || isStudent),
    );

  // Student class detail (homeroom teacher name) — depends on class id
  const studentClassRaw = React.useMemo(
    () => (isStudent ? (roleClassesData ?? [])[0] : undefined),
    [roleClassesData, isStudent],
  );
  const studentClassId = studentClassRaw?.id;

  const { data: studentClassDetail, isLoading: isLoadingStudentClassDetail } =
    useFetchData<LiveClass>(
      () =>
        classesApi
          .findOne(studentClassId!)
          .then((res) => res.data as unknown as LiveClass),
      [studentClassId],
      !isDemoMode && isStudent && !!studentClassId,
    );

  // ------------------------------------------------------------------
  // Admin: school members + subjects (for overview counts)
  // ------------------------------------------------------------------
  const { data: schoolMembersData, isLoading: isLoadingSchoolMembers } =
    useFetchData<LiveSchoolMember[]>(
      () =>
        schoolsApi
          .getMembers(selectedSchoolId)
          .then((res) => (Array.isArray(res.data) ? res.data : [])),
      [selectedSchoolId],
      goLive && isAdmin,
    );

  const { data: subjectsData, isLoading: isLoadingSubjects } = useFetchData<
    LiveSubject[]
  >(
    () =>
      subjectsApi
        .findSubjectsBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    goLive && isAdmin,
  );

  // ------------------------------------------------------------------
  // Parent: children links
  // ------------------------------------------------------------------
  const { data: parentChildrenData, isLoading: isLoadingParentChildren } =
    useFetchData<LiveParentChild[]>(
      () =>
        parentStudentsApi
          .getChildren(user?.id)
          .then((res) =>
            (Array.isArray(res.data) ? res.data : []) as unknown as LiveParentChild[],
          ),
      [user?.id],
      !isDemoMode && isParent,
    );

  // ==================================================================
  // Derived dashboard values
  // ==================================================================

  // ---- Upcoming assessments (teacher: recent published; student: pending) ----
  const displayAssessments: DisplayAssessment[] = React.useMemo(() => {
    if (isDemoMode) return getMockRecentAssessments(currentRole);
    if (isTeacher) {
      return teacherAssessments.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        subject: a.teachingAssignment?.subject?.name,
        due: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : tHooks("noDueDate"),
        questionsCount: a._count?.questions ?? a.questions?.length ?? 0,
        points: 0,
      }));
    }
    if (isStudent) {
      return studentAssessments
        .filter((a) => {
          const sub = a.submissions?.[0];
          return !sub || sub.status === "DRAFT";
        })
        .sort((a, b) => (a.dueAt ?? "").localeCompare(b.dueAt ?? ""))
        .slice(0, 3)
        .map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
        subject: a.teachingAssignment?.subject?.name,
        due: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : tHooks("noDueDate"),
        questionsCount: a._count?.questions ?? a.questions?.length ?? 0,
        points: 0,
      }));
    }
    return [];
  }, [
    isDemoMode,
    currentRole,
    isTeacher,
    isStudent,
    teacherAssessments,
    studentAssessments,
    tHooks,
  ]);

  // ---- School admin overview ----
  const schoolAdminOverview = React.useMemo(() => {
    if (isDemoMode) return getMockSchoolAdminOverview();
    const members = schoolMembersData ?? [];
    return {
      teachersCount: members.filter((m) => m.user?.role === "TEACHER").length,
      studentsCount: members.filter((m) => m.user?.role === "STUDENT").length,
      classesCount: activeAcademicYear?._count?.classes ?? 0,
      subjectsCount: (subjectsData ?? []).length,
    };
  }, [isDemoMode, schoolMembersData, activeAcademicYear, subjectsData]);

  const schoolAdminAcademicYear = React.useMemo(() => {
    if (isDemoMode) return getMockSchoolAdminAcademicYear();
    if (!activeAcademicYear) return null;
    return {
      name: activeAcademicYear.name,
      status: (activeAcademicYear.isActive ? "Active" : "Closed") as "Active" | "Closed",
      classesCount: activeAcademicYear._count?.classes ?? 0,
      studentsCount: activeAcademicYear._count?.enrollments ?? 0,
    };
  }, [isDemoMode, activeAcademicYear]);

  const schoolAdminActivity = React.useMemo(() => {
    if (isDemoMode) return getMockSchoolAdminRecentActivity();
    return submissions
      .slice()
      .sort((a, b) =>
        (b.submittedAt ?? b.startedAt).localeCompare(a.submittedAt ?? a.startedAt),
      )
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        action: tHooks("submittedAssessment", { title: s.assessment?.title ?? tHooks("assessment") }),
        user: s.student?.name ?? tHooks("unknown"),
        time: timeAgo(s.submittedAt ?? s.startedAt, tHooks),
      }));
  }, [isDemoMode, submissions, tHooks]);

  const adminIsLoading =
    isLoadingSchoolMembers ||
    isLoadingSubjects ||
    isLoadingSubmissions ||
    (academicYearsData === null && !isDemoMode);

  // ---- Teacher: my classes, pending results, class average ----
  const teacherClasses = React.useMemo(() => {
    if (isDemoMode) return getMockTeacherDashboardClasses();
    if (!isTeacher) return [];
    const enrollmentByClass = new Map<string, number>();
    (roleClassesData ?? []).forEach((c) =>
      enrollmentByClass.set(c.id, c._count?.enrollments ?? 0),
    );
    return (teachingAssignmentsData ?? [])
      .filter((a) => a.academicYearId === activeAyId)
      .map((a) => ({
        id: a.classId,
        name: a.class?.name ?? tHooks("dash"),
        subject: a.subject?.name ?? tHooks("dash"),
        studentCount: enrollmentByClass.get(a.classId) ?? 0,
        assessmentCount: a._count?.assessments ?? 0,
      }));
  }, [
    isDemoMode,
    isTeacher,
    roleClassesData,
    teachingAssignmentsData,
    activeAyId,
    tHooks,
  ]);

  const teacherPendingResults = React.useMemo(() => {
    if (isDemoMode) return 14;
    return submissions.filter((s) => s.status === "SUBMITTED").length;
  }, [isDemoMode, submissions]);

  const teacherClassAverage = React.useMemo(() => {
    if (isDemoMode) return 86.4;
    const scored = submissions
      .map((s) => s.scorePercentage)
      .filter((v): v is number => v !== null && v !== undefined);
    if (scored.length === 0) return null;
    return Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
  }, [isDemoMode, submissions]);

  const teacherIsLoading =
    isLoadingTeacherAssessments ||
    isLoadingSubmissions ||
    isLoadingTeachingAssignments ||
    isLoadingRoleClasses ||
    (academicYearsData === null && !isDemoMode);

  // ---- Student: quizzes taken, average, pending due, class, recent results ----
  const studentQuizzesTaken = React.useMemo(() => {
    if (isDemoMode) return 12;
    return submissions.filter(
      (s) => s.status === "SUBMITTED" || s.status === "GRADED",
    ).length;
  }, [isDemoMode, submissions]);

  const studentAverageScore = React.useMemo(() => {
    if (isDemoMode) return 92.5;
    const scored = submissions
      .map((s) => s.scorePercentage)
      .filter((v): v is number => v !== null && v !== undefined);
    if (scored.length === 0) return null;
    return Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
  }, [isDemoMode, submissions]);

  const studentPendingDue = React.useMemo(() => {
    if (isDemoMode) return 2;
    return studentAssessments.filter((a) => {
      const sub = a.submissions?.[0];
      return !sub || sub.status === "DRAFT";
    }).length;
  }, [isDemoMode, studentAssessments]);

  const studentClass = React.useMemo(() => {
    if (isDemoMode) return getMockStudentClassInfo();
    if (!isStudent) return null;
    const cls = studentClassRaw;
    if (!cls) return null;
    const homeroom =
      studentClassDetail?.homeroomAssignments?.[0]?.teacher?.name ?? tHooks("dash");
    return {
      id: cls.id,
      name: cls.name,
      grade: cls.grade,
      homeroomTeacher: homeroom,
      academicYear: cls.academicYear?.name ?? activeAcademicYear?.name ?? tHooks("dash"),
    };
  }, [
    isDemoMode,
    isStudent,
    studentClassRaw,
    studentClassDetail,
    activeAcademicYear,
    tHooks,
  ]);

  const studentRecentResults = React.useMemo(() => {
    if (isDemoMode) return getMockStudentRecentResults();
    return submissions
      .filter((s) => s.status === "SUBMITTED" || s.status === "GRADED")
      .slice()
      .sort((a, b) =>
        (b.submittedAt ?? b.startedAt).localeCompare(a.submittedAt ?? a.startedAt),
      )
      .slice(0, 3)
      .map((s) => ({
        id: s.id,
        assessment: s.assessment?.title ?? tHooks("assessment"),
        subject: s.assessment?.teachingAssignment?.subject?.name ?? tHooks("dash"),
        score:
          s.scorePercentage !== null && s.scorePercentage !== undefined
            ? Number(s.scorePercentage)
            : 0,
        date: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : tHooks("dash"),
      }));
  }, [isDemoMode, submissions, tHooks]);

  const studentIsLoading =
    isLoadingStudentAssessments ||
    isLoadingSubmissions ||
    isLoadingRoleClasses ||
    isLoadingStudentClassDetail ||
    (academicYearsData === null && !isDemoMode);

  // ---- Parent: children, avg, completed, recent results ----
  const parentChildren = React.useMemo(() => {
    if (isDemoMode) return getMockParentChildren();
    if (!isParent) return [];
    const latestByStudent = new Map<string, LiveSubmission>();
    submissions.forEach((s) => {
      const sid = s.student?.id;
      if (!sid) return;
      const prev = latestByStudent.get(sid);
      if (
        !prev ||
        (s.submittedAt ?? s.startedAt) > (prev.submittedAt ?? prev.startedAt)
      ) {
        latestByStudent.set(sid, s);
      }
    });
    return (parentChildrenData ?? []).map((link) => {
      const sid = link.student?.id ?? "";
      const enrollment = link.student?.enrollments?.[0];
      const latest = latestByStudent.get(sid);
      return {
        id: sid,
        name: link.student?.name ?? tHooks("unknown"),
        className: enrollment?.class?.name ?? tHooks("dash"),
        latestResult: latest
          ? `${latest.assessment?.title ?? tHooks("assessment")}: ${latest.scorePercentage ?? 0}%`
          : tHooks("noResultsYet"),
      };
    });
  }, [isDemoMode, isParent, parentChildrenData, submissions, tHooks]);

  const parentAvgScore = React.useMemo(() => {
    if (isDemoMode) return 92.5;
    const scored = submissions
      .map((s) => s.scorePercentage)
      .filter((v): v is number => v !== null && v !== undefined);
    if (scored.length === 0) return null;
    return Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
  }, [isDemoMode, submissions]);

  const parentCompletedCount = React.useMemo(() => {
    if (isDemoMode) return 12;
    return submissions.filter(
      (s) => s.status === "SUBMITTED" || s.status === "GRADED",
    ).length;
  }, [isDemoMode, submissions]);

  const parentRecentResults = React.useMemo(() => {
    if (isDemoMode) return getMockParentRecentResults();
    return submissions
      .filter((s) => s.status === "SUBMITTED" || s.status === "GRADED")
      .slice()
      .sort((a, b) =>
        (b.submittedAt ?? b.startedAt).localeCompare(a.submittedAt ?? a.startedAt),
      )
      .slice(0, 3)
      .map((s) => ({
        id: s.id,
        assessment: s.assessment?.title ?? tHooks("assessment"),
        subject: s.assessment?.teachingAssignment?.subject?.name ?? tHooks("dash"),
        score:
          s.scorePercentage !== null && s.scorePercentage !== undefined
            ? Number(s.scorePercentage)
            : 0,
        date: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : tHooks("dash"),
      }));
  }, [isDemoMode, submissions, tHooks]);

  const parentFirstChildGrade = React.useMemo(() => {
    if (isDemoMode) return getMockStudentClassInfo().grade;
    const first = (parentChildrenData ?? [])[0];
    return first?.student?.enrollments?.[0]?.class?.grade ?? 0;
  }, [isDemoMode, parentChildrenData]);

  const parentIsLoading = isLoadingParentChildren || isLoadingSubmissions;

  // Upcoming assessments card loading/error (assessments fetch only)
  const isLoadingLive = isTeacher
    ? isLoadingTeacherAssessments
    : isStudent
      ? isLoadingStudentAssessments
      : false;
  const liveFetchError = isTeacher
    ? teacherAssessmentsError
    : isStudent
      ? studentAssessmentsError
      : false;

  return {
    user,
    isDemoMode,
    currentRole,
    // assessments card
    liveAssessments: isTeacher ? teacherAssessments : studentAssessments,
    isLoadingLive,
    liveFetchError,
    displayAssessments,
    // admin
    schoolAdminOverview,
    schoolAdminAcademicYear,
    schoolAdminActivity,
    adminIsLoading,
    // teacher
    teacherClasses,
    teacherPendingResults,
    teacherClassAverage,
    teacherIsLoading,
    // student
    studentClass,
    studentQuizzesTaken,
    studentAverageScore,
    studentPendingDue,
    studentRecentResults,
    studentIsLoading,
    // parent
    parentChildren,
    parentAvgScore,
    parentCompletedCount,
    parentRecentResults,
    parentFirstChildGrade,
    parentIsLoading,
  };
}
