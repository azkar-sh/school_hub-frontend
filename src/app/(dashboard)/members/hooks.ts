import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { getMockMembers, MockMember } from "@/lib/mock-data";
import { schoolsApi, usersApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { SchoolMember, UserRole } from "@/types";

export const ROLE_FILTERS: Array<{ label: string; value: "ALL" | UserRole }> = [
  { label: "All", value: "ALL" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
  { label: "Parent", value: "PARENT" },
];

export function useMembersPage() {
  const { isDemoMode } = useAuthStore();

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | UserRole>("ALL");
  const [selectedMember, setSelectedMember] = React.useState<MockMember | null>(
    null,
  );

  // School selection is cached & shared across all dashboard pages.
  // Admin can manage members of any school, so we list all schools.
  const { schools, selectedSchoolId, setSelectedSchoolId, isLoading } =
    useSchoolSelection({ fetchAllForAdmin: true });

  const { data: usersData } = useFetchData(
    () =>
      usersApi
        .findAll({ limit: 100 })
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [],
    !isDemoMode,
  );
  const usersList = usersData ?? [];

  const { data: membersData, refetch: refetchMembers } = useFetchData(
    () =>
      schoolsApi
        .getMembers(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const schoolMembers = (membersData ?? []) as SchoolMember[];

  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Add member modal
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [memberUserId, setMemberUserId] = React.useState("");

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !memberUserId) return;
    try {
      setFeedbackMsg(null);
      if (isDemoMode) {
        setFeedbackMsg("User added to school (Demo Mode)");
        setShowAddModal(false);
        setMemberUserId("");
        return;
      }
      await schoolsApi.addMember(selectedSchoolId, { userId: memberUserId });
      setMemberUserId("");
      setShowAddModal(false);
      setFeedbackMsg("School member added successfully!");
      refetchMembers();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to add school member"));
    }
  };

  // Build display list
  const mockMembers = getMockMembers();

  const displayMembers: MockMember[] = isDemoMode
    ? mockMembers
    : schoolMembers.map((m) => ({
        id: m.id,
        name: m.user?.name || "Unknown",
        email: m.user?.email || "",
        role: (m.user?.role || "STUDENT") as UserRole,
        schoolName:
          schools.find((s) => s.id === m.schoolId)?.name || "SMA Garuda Hope",
      }));

  const filteredMembers = displayMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return {
    isDemoMode,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    selectedMember,
    setSelectedMember,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    isLoading,
    usersList,
    feedbackMsg,
    setFeedbackMsg,
    showAddModal,
    setShowAddModal,
    memberUserId,
    setMemberUserId,
    handleAddMember,
    filteredMembers,
  };
}
