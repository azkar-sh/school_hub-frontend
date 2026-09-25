import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { useFetchData } from "@/lib/use-fetch-data";
import {
  teachingAssignmentsApi,
  schoolsApi,
  subjectsApi,
  classesApi,
  academicYearsApi,
} from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import {
  TeachingAssignment,
  SchoolMember,
  PaginatedResponse,
  Subject,
  Class,
  AcademicYear,
  User,
} from "@/types";

export function useTeachingAssignmentsPage() {
  const { isDemoMode } = useAuthStore();
  const { schools, selectedSchoolId, setSelectedSchoolId } = useSchoolSelection();

  // Search & Filter
  const [search, setSearch] = React.useState("");
  const [filterSubjectId, setFilterSubjectId] = React.useState("");
  const [filterClassId, setFilterClassId] = React.useState("");

  // Modal & Form
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [teacherId, setTeacherId] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");
  const [classId, setClassId] = React.useState("");
  const [academicYearId, setAcademicYearId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Fetch Teaching Assignments for selected school
  const {
    data: assignmentsData,
    isLoading,
    refetch: refetchAssignments,
  } = useFetchData(
    () =>
      teachingAssignmentsApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const assignmentsList = (assignmentsData ?? []) as TeachingAssignment[];

  // Fetch School Members to get Teachers
  const { data: membersData } = useFetchData(
    () =>
      schoolsApi
        .getMembers(selectedSchoolId)
        .then((res) =>
          Array.isArray(res.data)
            ? res.data
            : (res.data as PaginatedResponse<SchoolMember>)?.items || [],
        ),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const teachersList = React.useMemo(() => {
    const members = (membersData ?? []) as SchoolMember[];
    return members
      .filter((m) => m.user?.role === "TEACHER" && !!m.user)
      .map((m) => m.user as User);
  }, [membersData]);

  // Fetch Subjects for School
  const { data: subjectsData } = useFetchData(
    () =>
      subjectsApi
        .findSubjectsBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const subjectsList = (subjectsData ?? []) as Subject[];

  // Fetch Classes for School
  const { data: classesData } = useFetchData(
    () =>
      classesApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const classesList = (classesData ?? []) as Class[];

  // Fetch Academic Years for School
  const { data: academicYearsData } = useFetchData(
    () =>
      academicYearsApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const academicYearsList = (academicYearsData ?? []) as AcademicYear[];

  // Auto-set default active academic year when loaded
  React.useEffect(() => {
    if (!academicYearId && academicYearsList.length > 0) {
      const active = academicYearsList.find((ay) => ay.isActive) || academicYearsList[0];
      setAcademicYearId(active.id);
    }
  }, [academicYearsList, academicYearId]);

  // Filtered Assignments
  const filteredAssignments = React.useMemo(() => {
    return assignmentsList.filter((item) => {
      const teacherName = item.teacher?.name?.toLowerCase() || "";
      const subjectName = item.subject?.name?.toLowerCase() || "";
      const className = item.class?.name?.toLowerCase() || "";
      const q = search.toLowerCase();

      const matchesSearch =
        !search ||
        teacherName.includes(q) ||
        subjectName.includes(q) ||
        className.includes(q);

      const matchesSubject = !filterSubjectId || item.subjectId === filterSubjectId;
      const matchesClass = !filterClassId || item.classId === filterClassId;

      return matchesSearch && matchesSubject && matchesClass;
    });
  }, [assignmentsList, search, filterSubjectId, filterClassId]);

  // Handlers
  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !subjectId || !classId || !academicYearId) return;

    try {
      setIsSubmitting(true);
      setFeedbackMsg(null);

      await teachingAssignmentsApi.create({
        teacherId,
        subjectId,
        classId,
        academicYearId,
      });

      setTeacherId("");
      setSubjectId("");
      setClassId("");
      setShowAssignModal(false);
      setFeedbackMsg("Teaching assignment created successfully!");
      refetchAssignments();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create teaching assignment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isDemoMode,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    search,
    setSearch,
    filterSubjectId,
    setFilterSubjectId,
    filterClassId,
    setFilterClassId,
    showAssignModal,
    setShowAssignModal,
    teacherId,
    setTeacherId,
    subjectId,
    setSubjectId,
    classId,
    setClassId,
    academicYearId,
    setAcademicYearId,
    isSubmitting,
    feedbackMsg,
    setFeedbackMsg,
    isLoading,
    assignmentsList,
    filteredAssignments,
    teachersList,
    subjectsList,
    classesList,
    academicYearsList,
    handleAssignTeacher,
  };
}
