import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  schoolsApi,
  academicYearsApi,
  usersApi,
  parentStudentsApi,
} from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { AcademicYear, ParentRelationship, SchoolMember } from "@/types";

export type AdminTab = "schools" | "academicYears" | "members" | "parents";

// Demo Fallback Data
const DEMO_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: "ay-1",
    schoolId: "demo-school-id",
    name: "2025/2026",
    startsAt: "2025-07-01",
    endsAt: "2026-06-30",
    isActive: true,
  },
  {
    id: "ay-2",
    schoolId: "demo-school-id",
    name: "2026/2027",
    startsAt: "2026-07-01",
    endsAt: "2027-06-30",
    isActive: true,
  },
];

export function useAdminPage() {
  const { isDemoMode } = useAuthStore();

  const [activeTab, setActiveTab] = React.useState<AdminTab>("schools");

  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    refetch: refetchSchools,
  } = useSchoolSelection({ fetchAllForAdmin: true });

  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form States
  const [schoolName, setSchoolName] = React.useState("");
  const [ayName, setAyName] = React.useState("");
  const [ayStartsAt, setAyStartsAt] = React.useState("");
  const [ayEndsAt, setAyEndsAt] = React.useState("");

  const [memberUserId, setMemberUserId] = React.useState("");

  // Parent-Student Link Form
  const [linkParentId, setLinkParentId] = React.useState("");
  const [linkStudentId, setLinkStudentId] = React.useState("");
  const [linkRelationship, setLinkRelationship] =
    React.useState<ParentRelationship>("FATHER");

  // Fetch academic years via hook
  const { data: academicYearsData, refetch: refetchAcademicYears } =
    useFetchData(
      () =>
        academicYearsApi
          .findBySchool(selectedSchoolId)
          .then((res) => (Array.isArray(res.data) ? res.data : [])),
      [selectedSchoolId],
      !isDemoMode && !!selectedSchoolId,
    );
  const academicYears = isDemoMode
    ? DEMO_ACADEMIC_YEARS
    : (academicYearsData ?? []);

  // Mutation loading state (for form submit buttons — used in event handlers, NOT effects)
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch school members via hook
  const { data: membersData, refetch: refetchMembers } = useFetchData(
    () =>
      schoolsApi
        .getMembers(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const schoolMembers = (membersData ?? []) as SchoolMember[];

  // Fetch users via hook
  const { data: usersData } = useFetchData(
    () =>
      usersApi
        .findAll({ limit: 100 })
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [],
    !isDemoMode,
  );
  const usersList = usersData ?? [];

  // Handlers
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    try {
      setFeedback(null);
      setIsLoading(true);
      if (isDemoMode) {
        setSchoolName("");
        setFeedback({ type: "success", message: "School created (Demo Mode)" });
        return;
      }
      await schoolsApi.create({ name: schoolName });
      setSchoolName("");
      setFeedback({ type: "success", message: "School created successfully!" });
      refetchSchools();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to create school"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAcademicYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !ayName.trim() || !ayStartsAt || !ayEndsAt) return;
    try {
      setFeedback(null);
      setIsLoading(true);
      if (isDemoMode) {
        setAyName("");
        setFeedback({
          type: "success",
          message: "Academic Year created (Demo Mode)",
        });
        return;
      }
      await academicYearsApi.create({
        schoolId: selectedSchoolId,
        name: ayName,
        startsAt: ayStartsAt,
        endsAt: ayEndsAt,
      });
      setAyName("");
      setAyStartsAt("");
      setAyEndsAt("");
      setFeedback({
        type: "success",
        message: "Academic year created successfully!",
      });
      refetchAcademicYears();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to create academic year"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !memberUserId) return;
    try {
      setFeedback(null);
      setIsLoading(true);
      if (isDemoMode) {
        setFeedback({
          type: "success",
          message: "User added to school (Demo Mode)",
        });
        return;
      }
      await schoolsApi.addMember(selectedSchoolId, { userId: memberUserId });
      setMemberUserId("");
      setFeedback({
        type: "success",
        message: "School member added successfully!",
      });
      refetchMembers();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to add school member"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkParentStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkParentId || !linkStudentId) return;
    try {
      setFeedback(null);
      setIsLoading(true);
      if (isDemoMode) {
        setFeedback({
          type: "success",
          message: "Parent linked to student (Demo Mode)",
        });
        return;
      }
      await parentStudentsApi.link({
        parentId: linkParentId,
        studentId: linkStudentId,
        relationship: linkRelationship,
      });
      setLinkParentId("");
      setLinkStudentId("");
      setFeedback({
        type: "success",
        message: "Parent successfully linked to student!",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to link parent and student"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDemoMode,
    activeTab,
    setActiveTab,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    feedback,
    schoolName,
    setSchoolName,
    ayName,
    setAyName,
    ayStartsAt,
    setAyStartsAt,
    ayEndsAt,
    setAyEndsAt,
    memberUserId,
    setMemberUserId,
    linkParentId,
    setLinkParentId,
    linkStudentId,
    setLinkStudentId,
    linkRelationship,
    setLinkRelationship,
    academicYears,
    isLoading,
    schoolMembers,
    usersList,
    handleCreateSchool,
    handleCreateAcademicYear,
    handleAddMember,
    handleLinkParentStudent,
  };
}
