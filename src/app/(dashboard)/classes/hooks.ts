import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockClasses } from "@/lib/mock-data";
import { classesApi, academicYearsApi, usersApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { Class, AcademicYear, User } from "@/types";

export function useClassesPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // School selection is cached & shared across all dashboard pages
  const { schools, selectedSchoolId, setSelectedSchoolId } =
    useSchoolSelection();
  const [academicYears, setAcademicYears] = React.useState<AcademicYear[]>([]);
  const [selectedAyId, setSelectedAyId] = React.useState<string>("");
  const [usersList, setUsersList] = React.useState<User[]>([]);

  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Modals State
  const [showCreateClassModal, setShowCreateClassModal] = React.useState(false);
  const [classNameInput, setClassNameInput] = React.useState("");
  const [classGradeInput, setClassGradeInput] = React.useState<number>(8);

  const [activeEnrollClassId, setActiveEnrollClassId] = React.useState<
    string | null
  >(null);
  const [enrollStudentId, setEnrollStudentId] = React.useState("");

  const [activeHomeroomClassId, setActiveHomeroomClassId] = React.useState<
    string | null
  >(null);
  const [homeroomTeacherId, setHomeroomTeacherId] = React.useState("");

  const [activeViewClassId, setActiveViewClassId] = React.useState<
    string | null
  >(null);

  // Initial fetch for real users
  React.useEffect(() => {
    if (isDemoMode) return;
    usersApi.findAll({ limit: 100 }).then((res) => {
      setUsersList(Array.isArray(res.data) ? res.data : []);
    });
  }, [isDemoMode]);

  React.useEffect(() => {
    if (selectedSchoolId && !isDemoMode) {
      academicYearsApi.findBySchool(selectedSchoolId).then((res) => {
        const ays = Array.isArray(res.data) ? res.data : [];
        setAcademicYears(ays);
        if (ays.length > 0) setSelectedAyId(ays[0].id);
      });
    }
  }, [selectedSchoolId, isDemoMode]);

  // Fetch classes via hook (no sync setState in effects)
  const {
    data: classesData,
    isLoading,
    refetch: refetchClasses,
  } = useFetchData(
    () =>
      classesApi
        .findBySchool(selectedSchoolId, selectedAyId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId, selectedAyId],
    !isDemoMode && !!selectedSchoolId,
  );
  const classesList = React.useMemo(
    () => (classesData ?? []) as Class[],
    [classesData],
  );

  const {
    data: registeredStudentsData,
    isLoading: isLoadingRegisteredStudents,
    refetch: refetchRegisteredStudents,
  } = useFetchData(
    () =>
      classesApi
        .getRegisteredStudents(activeEnrollClassId!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [activeEnrollClassId],
    !isDemoMode && !!activeEnrollClassId,
  );
  const registeredStudentsList = (registeredStudentsData ?? []) as User[];

  const {
    data: viewStudentsData,
    isLoading: isLoadingViewStudents,
  } = useFetchData(
    () =>
      classesApi
        .getRegisteredStudents(activeViewClassId!)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [activeViewClassId],
    !isDemoMode && !!activeViewClassId,
  );
  const viewStudentsList = (viewStudentsData ?? []) as User[];

  const activeViewClassName = React.useMemo(
    () => classesList.find((c) => c.id === activeViewClassId)?.name ?? "",
    [classesList, activeViewClassId],
  );

  // Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !selectedAyId || !classNameInput.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Class created in demo mode"); // i18n: TODO
        setShowCreateClassModal(false);
        return;
      }
      await classesApi.create({
        schoolId: selectedSchoolId,
        academicYearId: selectedAyId,
        name: classNameInput,
        grade: Number(classGradeInput) || 8,
      });
      setClassNameInput("");
      setShowCreateClassModal(false);
      setFeedbackMsg("Class created successfully!"); // i18n: TODO
      refetchClasses();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create class")); // i18n: TODO
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrollClassId || !selectedAyId || !enrollStudentId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Student enrolled in demo mode"); // i18n: TODO
        setActiveEnrollClassId(null);
        return;
      }
      await classesApi.enrollStudent(activeEnrollClassId, {
        studentId: enrollStudentId,
        academicYearId: selectedAyId,
      });
      setEnrollStudentId("");
      setActiveEnrollClassId(null);
      setFeedbackMsg("Student enrolled successfully!"); // i18n: TODO
      if (selectedSchoolId) refetchClasses();
      refetchRegisteredStudents();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to enroll student")); // i18n: TODO
    }
  };

  const handleAssignHomeroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHomeroomClassId || !selectedAyId || !homeroomTeacherId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Homeroom teacher assigned in demo mode"); // i18n: TODO
        setActiveHomeroomClassId(null);
        return;
      }
      await classesApi.assignHomeroom(activeHomeroomClassId, {
        teacherId: homeroomTeacherId,
        academicYearId: selectedAyId,
      });
      setHomeroomTeacherId("");
      setActiveHomeroomClassId(null);
      setFeedbackMsg("Homeroom teacher assigned successfully!"); // i18n: TODO
      if (selectedSchoolId) refetchClasses();
    } catch (error) {
      setFeedbackMsg(
        getErrorMessage(error, "Failed to assign homeroom teacher"), // i18n: TODO
      );
    }
  };

  // Demo classes fallback
  const mockClasses = getMockClasses(currentRole);

  const canManageClasses = currentRole === "SCHOOL_ADMIN";
  const currentUserId = user?.id;

  return {
    isDemoMode,
    currentRole,
    currentUserId,
    canManageClasses,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    academicYears,
    selectedAyId,
    setSelectedAyId,
    usersList,
    feedbackMsg,
    setFeedbackMsg,
    showCreateClassModal,
    setShowCreateClassModal,
    classNameInput,
    setClassNameInput,
    classGradeInput,
    setClassGradeInput,
    activeEnrollClassId,
    setActiveEnrollClassId,
    enrollStudentId,
    setEnrollStudentId,
    activeHomeroomClassId,
    setActiveHomeroomClassId,
    homeroomTeacherId,
    setHomeroomTeacherId,
    activeViewClassId,
    setActiveViewClassId,
    activeViewClassName,
    viewStudentsList,
    isLoadingViewStudents,
    isLoading,
    classesList,
    registeredStudentsList,
    isLoadingRegisteredStudents,
    mockClasses,
    handleCreateClass,
    handleEnrollStudent,
    handleAssignHomeroom,
  };
}
