import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { getMockMembers, MockMember } from "@/lib/mock-data";
import { schoolsApi, usersApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import {
  SchoolMember,
  User,
  UserRole,
  PaginatedResponse,
} from "@/types";

export const ROLE_FILTERS: Array<{ label: string; value: "ALL" | UserRole }> = [
  { label: "All", value: "ALL" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
  { label: "Parent", value: "PARENT" },
  { label: "Admin", value: "SCHOOL_ADMIN" },
];

export function useMembersPage() {
  const { isDemoMode } = useAuthStore();

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | UserRole>("ALL");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");

  const [selectedMember, setSelectedMember] = React.useState<MockMember | null>(
    null,
  );
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  // School selection is cached & shared across all dashboard pages.
  const { schools, selectedSchoolId, setSelectedSchoolId, isLoading: isLoadingSchools } =
    useSchoolSelection({ fetchAllForAdmin: true });

  // Users list for Add Member dropdown
  const { data: usersData } = useFetchData(
    () =>
      usersApi
        .findAll({ limit: 100 })
        .then((res) => {
          const data = res.data as unknown as User[] | { items: User[] };
          return Array.isArray(data) ? data : data?.items ?? [];
        }),
    [],
    !isDemoMode,
  );
  const usersList = usersData ?? [];

  // Reset page when search or roleFilter changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilterChange = (role: "ALL" | UserRole) => {
    setRoleFilter(role);
    setPage(1);
  };

  // Fetch school members
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: isMembersError,
    refetch: refetchMembers,
  } = useFetchData(
    () =>
      schoolsApi
        .getMembers(selectedSchoolId, {
          page,
          limit,
          search: search.trim() || undefined,
          role: roleFilter === "ALL" ? undefined : roleFilter,
        })
        .then((res) => res.data),
    [selectedSchoolId, page, limit, search, roleFilter],
    !isDemoMode && !!selectedSchoolId,
  );

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

  // Demo mode data handling
  const mockMembers = React.useMemo(() => getMockMembers(), []);

  // Compute members & pagination
  const { displayMembers, pagination } = React.useMemo(() => {
    if (isDemoMode) {
      const filtered = mockMembers.filter((m) => {
        const matchesSearch =
          !search.trim() ||
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
        return matchesSearch && matchesRole;
      });

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const paged = filtered.slice((page - 1) * limit, page * limit);

      return {
        displayMembers: paged,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }

    // Live mode
    const rawData = membersData;
    let items: SchoolMember[] = [];
    let meta = {
      total: 0,
      page,
      limit,
      totalPages: 1,
    };

    if (rawData && "items" in (rawData as object)) {
      const paginated = rawData as PaginatedResponse<SchoolMember>;
      items = paginated.items || [];
      meta = paginated.meta || meta;
    } else if (Array.isArray(rawData)) {
      items = rawData as SchoolMember[];
      meta = {
        total: items.length,
        page: 1,
        limit: items.length,
        totalPages: 1,
      };
    }

    const mapped: MockMember[] = items.map((m) => {
      const u = m.user;
      return {
        id: m.id,
        userId: u?.id || m.userId,
        name: u?.name || "Unknown",
        email: u?.email || "",
        role: (u?.role || "STUDENT") as UserRole,
        schoolName:
          schools.find((s) => s.id === m.schoolId)?.name ||
          m.school?.name ||
          "School",
        createdAt: u?.createdAt || m.createdAt,
        teachingAssignments: u?.teachingAssignments?.map((ta) => ({
          id: ta.id,
          subjectName: ta.subject?.name || "Subject",
          subjectCode: ta.subject?.code || "SUB",
          className: ta.class?.name || "Class",
          grade: ta.class?.grade ?? 0,
          academicYear: ta.academicYear?.name || "",
        })),
        homeroomAssignment: u?.homeroomAssignments?.[0]
          ? {
              className: u.homeroomAssignments[0].class?.name || "",
              grade: u.homeroomAssignments[0].class?.grade ?? 0,
              academicYear: u.homeroomAssignments[0].academicYear?.name || "",
            }
          : null,
        enrollment: u?.enrollments?.[0]
          ? {
              className: u.enrollments[0].class?.name || "",
              grade: u.enrollments[0].class?.grade ?? 0,
              academicYear: u.enrollments[0].academicYear?.name || "",
              enrolledAt: u.enrollments[0].enrolledAt,
            }
          : null,
        guardians: u?.studentLinks?.map((sl) => ({
          id: sl.parent?.id,
          name: sl.parent?.name || "Guardian",
          email: sl.parent?.email || "",
          relationship: sl.relationship,
        })),
        children: u?.parentLinks?.map((pl) => ({
          id: pl.student?.id,
          name: pl.student?.name || "Student",
          email: pl.student?.email || "",
          relationship: pl.relationship,
          className: pl.student?.enrollments?.[0]?.class?.name,
        })),
      };
    });

    return {
      displayMembers: mapped,
      pagination: meta,
    };
  }, [
    isDemoMode,
    mockMembers,
    search,
    roleFilter,
    page,
    limit,
    membersData,
    schools,
  ]);

  const handleSelectMember = React.useCallback(
    async (member: MockMember) => {
      setSelectedMember(member);
      if (!isDemoMode && member.userId) {
        setIsLoadingDetails(true);
        try {
          const res = await usersApi.findOne(member.userId);
          const u = res.data;
          if (u) {
            setSelectedMember((prev) => {
              if (!prev || (prev.userId !== u.id && prev.id !== u.id))
                return prev;
              return {
                ...prev,
                name: u.name || prev.name,
                email: u.email || prev.email,
                role: u.role || prev.role,
                createdAt: u.createdAt || prev.createdAt,
                teachingAssignments:
                  u.teachingAssignments?.map((ta) => ({
                    id: ta.id,
                    subjectName: ta.subject?.name || "Subject",
                    subjectCode: ta.subject?.code || "SUB",
                    className: ta.class?.name || "Class",
                    grade: ta.class?.grade ?? 0,
                    academicYear: ta.academicYear?.name || "",
                  })) ?? prev.teachingAssignments,
                homeroomAssignment: u.homeroomAssignments?.[0]
                  ? {
                      className: u.homeroomAssignments[0].class?.name || "",
                      grade: u.homeroomAssignments[0].class?.grade ?? 0,
                      academicYear:
                        u.homeroomAssignments[0].academicYear?.name || "",
                    }
                  : prev.homeroomAssignment,
                enrollment: u.enrollments?.[0]
                  ? {
                      className: u.enrollments[0].class?.name || "",
                      grade: u.enrollments[0].class?.grade ?? 0,
                      academicYear:
                        u.enrollments[0].academicYear?.name || "",
                      enrolledAt: u.enrollments[0].enrolledAt,
                    }
                  : prev.enrollment,
                guardians:
                  u.studentLinks?.map((sl) => ({
                    id: sl.parent?.id,
                    name: sl.parent?.name || "Guardian",
                    email: sl.parent?.email || "",
                    relationship: sl.relationship,
                  })) ?? prev.guardians,
                children:
                  u.parentLinks?.map((pl) => ({
                    id: pl.student?.id,
                    name: pl.student?.name || "Student",
                    email: pl.student?.email || "",
                    relationship: pl.relationship,
                    className: pl.student?.enrollments?.[0]?.class?.name,
                  })) ?? prev.children,
              };
            });
          }
        } catch {
          // Keep current member state if findOne fails
        } finally {
          setIsLoadingDetails(false);
        }
      }
    },
    [isDemoMode],
  );

  return {
    isDemoMode,
    search,
    setSearch: handleSearchChange,
    roleFilter,
    setRoleFilter: handleRoleFilterChange,
    page,
    setPage,
    pagination,
    viewMode,
    setViewMode,
    selectedMember,
    setSelectedMember,
    isLoadingDetails,
    handleSelectMember,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    isLoading: isLoadingMembers || isLoadingSchools,
    isError: !!isMembersError,
    refetchMembers,
    usersList,
    feedbackMsg,
    setFeedbackMsg,
    showAddModal,
    setShowAddModal,
    memberUserId,
    setMemberUserId,
    handleAddMember,
    displayMembers,
  };
}
