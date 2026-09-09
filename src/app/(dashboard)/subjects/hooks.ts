import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubjects } from "@/lib/mock-data";
import { subjectsApi, teachingAssignmentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { Subject, TeachingAssignment } from "@/types";

export function useSubjectsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;
  const isTeacher = currentRole === "TEACHER";

  // School selection is cached & shared across all dashboard pages
  const { schools, selectedSchoolId, setSelectedSchoolId } =
    useSchoolSelection();
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Modal / Form Dialog States
  const [showAddSubjectModal, setShowAddSubjectModal] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState("");
  const [newSubjectCode, setNewSubjectCode] = React.useState("");

  const [activeTopicSubjectId, setActiveTopicSubjectId] = React.useState<
    string | null
  >(null);
  const [newTopicName, setNewTopicName] = React.useState("");
  const [newTopicDesc, setNewTopicDesc] = React.useState("");

  const [activeSubTopicTopicId, setActiveSubTopicTopicId] = React.useState<
    string | null
  >(null);
  const [newSubTopicName, setNewSubTopicName] = React.useState("");
  const [newSubTopicDesc, setNewSubTopicDesc] = React.useState("");

  // Fetch subjects via hook (no sync setState in effects)
  const {
    data: subjectsData,
    isLoading,
    refetch: refetchSubjects,
  } = useFetchData(
    () =>
      subjectsApi
        .findSubjectsBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const subjectsList = (subjectsData ?? []) as Subject[];

  // Fetch teaching assignments for teacher role (for assigned/other split)
  const { data: teachingAssignmentsData } = useFetchData(
    () =>
      teachingAssignmentsApi
        .findByTeacher(user?.id)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [user?.id],
    !isDemoMode && isTeacher && !!user?.id,
  );
  const teachingAssignments = (teachingAssignmentsData ?? []) as TeachingAssignment[];

  // Fetch all teaching assignments for the school (all roles — for teacher names display)
  const { data: schoolAssignmentsData } = useFetchData(
    () =>
      teachingAssignmentsApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const schoolAssignments = (schoolAssignmentsData ?? []) as TeachingAssignment[];

  // Compute assigned vs other subjects for teacher
  const assignedSubjectIds = React.useMemo(
    () => new Set(teachingAssignments.map((ta) => ta.subjectId)),
    [teachingAssignments],
  );

  const subjectClassesMap = React.useMemo(() => {
    const map: Record<string, TeachingAssignment[]> = {};
    for (const ta of teachingAssignments) {
      if (!map[ta.subjectId]) map[ta.subjectId] = [];
      map[ta.subjectId].push(ta);
    }
    return map;
  }, [teachingAssignments]);

  // Map subjectId → unique teacher names (from school-wide assignments)
  const subjectTeachersMap = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const ta of schoolAssignments) {
      if (!map[ta.subjectId]) map[ta.subjectId] = [];
      const teacherName = ta.teacher?.name;
      if (teacherName && !map[ta.subjectId].includes(teacherName)) {
        map[ta.subjectId].push(teacherName);
      }
    }
    return map;
  }, [schoolAssignments]);

  const assignedSubjects = React.useMemo(
    () =>
      isTeacher
        ? subjectsList.filter((s) => assignedSubjectIds.has(s.id))
        : [],
    [isTeacher, subjectsList, assignedSubjectIds],
  );

  const otherSubjects = React.useMemo(
    () =>
      isTeacher
        ? subjectsList.filter((s) => !assignedSubjectIds.has(s.id))
        : [],
    [isTeacher, subjectsList, assignedSubjectIds],
  );

  // Handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Subject created in demo mode");
        setShowAddSubjectModal(false);
        return;
      }
      if (!selectedSchoolId) {
        setFeedbackMsg("Please select a school first");
        return;
      }
      await subjectsApi.createSubject({
        schoolId: selectedSchoolId,
        name: newSubjectName,
        code: newSubjectCode,
      });
      setNewSubjectName("");
      setNewSubjectCode("");
      setShowAddSubjectModal(false);
      setFeedbackMsg("Subject created successfully!");
      refetchSubjects();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create subject"));
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopicSubjectId || !newTopicName.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Topic created in demo mode");
        setActiveTopicSubjectId(null);
        return;
      }
      await subjectsApi.createTopic({
        subjectId: activeTopicSubjectId,
        name: newTopicName,
        description: newTopicDesc,
      });
      setNewTopicName("");
      setNewTopicDesc("");
      setActiveTopicSubjectId(null);
      setFeedbackMsg("Topic added successfully!");
      if (selectedSchoolId) refetchSubjects();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to add topic"));
    }
  };

  const handleCreateSubTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubTopicTopicId || !newSubTopicName.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Sub-topic created in demo mode");
        setActiveSubTopicTopicId(null);
        return;
      }
      await subjectsApi.createSubTopic({
        topicId: activeSubTopicTopicId,
        name: newSubTopicName,
        description: newSubTopicDesc,
      });
      setNewSubTopicName("");
      setNewSubTopicDesc("");
      setActiveSubTopicTopicId(null);
      setFeedbackMsg("Sub-topic added successfully!");
      if (selectedSchoolId) refetchSubjects();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to add sub-topic"));
    }
  };

  // Mock data conversion for demo mode display
  const displaySubjects = isDemoMode ? getMockSubjects(currentRole) : [];

  const canEditCurriculum =
    currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";

  const canAddSubject = currentRole === "SCHOOL_ADMIN";

  return {
    isDemoMode,
    currentRole,
    isTeacher,
    canEditCurriculum,
    canAddSubject,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    feedbackMsg,
    setFeedbackMsg,
    showAddSubjectModal,
    setShowAddSubjectModal,
    newSubjectName,
    setNewSubjectName,
    newSubjectCode,
    setNewSubjectCode,
    activeTopicSubjectId,
    setActiveTopicSubjectId,
    newTopicName,
    setNewTopicName,
    newTopicDesc,
    setNewTopicDesc,
    activeSubTopicTopicId,
    setActiveSubTopicTopicId,
    newSubTopicName,
    setNewSubTopicName,
    newSubTopicDesc,
    setNewSubTopicDesc,
    isLoading,
    subjectsList,
    assignedSubjects,
    otherSubjects,
    subjectClassesMap,
    subjectTeachersMap,
    displaySubjects,
    handleCreateSubject,
    handleCreateTopic,
    handleCreateSubTopic,
  };
}
