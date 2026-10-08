import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  schoolsApi,
  usersApi,
  classesApi,
  parentStudentsApi,
} from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import {
  Class,
  ParentRelationship,
  ParentStudent,
  ParentStudentOverviewResponse,
  School,
  User,
} from "@/types";

export type AdminTab = "institution" | "guardianship" | "operations";

interface SchoolWithCount extends School {
  _count?: {
    members?: number;
    classes?: number;
  };
}

export function useAdminPage() {
  const { user, isDemoMode } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<AdminTab>(() => {
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      if (tabParam === "guardianship" || tabParam === "operations") return tabParam;
    }
    return "institution";
  });

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

  // Form & Modal States
  const [showCreateSchoolModal, setShowCreateSchoolModal] = React.useState(false);
  const [schoolName, setSchoolName] = React.useState("");

  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [linkParentId, setLinkParentId] = React.useState("");
  const [linkStudentId, setLinkStudentId] = React.useState("");
  const [linkRelationship, setLinkRelationship] =
    React.useState<ParentRelationship>("FATHER");

  // Guardianship Filtering & View State
  const [searchGuardians, setSearchGuardians] = React.useState("");
  const [selectedClassFilter, setSelectedClassFilter] = React.useState("all");
  const [relationshipFilter, setRelationshipFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "linked" | "unlinked">("all");
  const [viewMode, setViewMode] = React.useState<"accordion" | "flat">("accordion");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch Detailed School Info
  const {
    data: schoolDetailsData,
    isLoading: isLoadingSchool,
    refetch: refetchSchoolDetails,
  } = useFetchData(
    () =>
      schoolsApi
        .findOne(selectedSchoolId)
        .then((res) => (res.data ? (res.data as SchoolWithCount) : null)),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const schoolDetails = schoolDetailsData ?? (schools.find((s) => s.id === selectedSchoolId) as SchoolWithCount | undefined);

  // Fetch Classes for the selected school
  const { data: classesData, isLoading: isLoadingClasses } = useFetchData(
    () =>
      classesApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const classesList = (classesData ?? []) as Class[];

  // Fetch Parent-Student Overview (by-class hierarchy & statistics)
  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
  } = useFetchData(
    () =>
      parentStudentsApi
        .getOverview(selectedSchoolId)
        .then((res) => res.data),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const parentStudentOverview = (overviewData ?? null) as ParentStudentOverviewResponse | null;

  // Fetch Flat Parent-Student Links
  const {
    data: parentLinksData,
    isLoading: isLoadingLinks,
    refetch: refetchLinks,
  } = useFetchData(
    () =>
      parentStudentsApi
        .findAll({
          schoolId: selectedSchoolId,
          classId: selectedClassFilter !== "all" ? selectedClassFilter : undefined,
          relationship:
            relationshipFilter !== "all"
              ? (relationshipFilter as ParentRelationship)
              : undefined,
        })
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId, selectedClassFilter, relationshipFilter],
    !isDemoMode,
  );
  const parentStudentLinks = (parentLinksData ?? []) as ParentStudent[];

  // Fetch Users for Dropdowns
  const { data: usersData, isLoading: isLoadingUsers } = useFetchData(
    () =>
      usersApi
        .findAll({ limit: 300 })
        .then((res) => {
          if (Array.isArray(res.data)) return res.data;
          if (res.data && Array.isArray((res.data as any).items)) return (res.data as any).items;
          return [];
        }),
    [],
    !isDemoMode,
  );
  const usersList = (usersData ?? []) as User[];

  const parentsList = React.useMemo(
    () => usersList.filter((u) => u.role === "PARENT"),
    [usersList],
  );

  const studentsList = React.useMemo(
    () => usersList.filter((u) => u.role === "STUDENT"),
    [usersList],
  );

  // Filtered Guardian Links (for Flat View)
  const filteredLinks = React.useMemo(() => {
    let result = parentStudentLinks;

    if (searchGuardians.trim()) {
      const q = searchGuardians.toLowerCase();
      result = result.filter(
        (link) =>
          link.parent?.name?.toLowerCase().includes(q) ||
          link.parent?.email?.toLowerCase().includes(q) ||
          link.student?.name?.toLowerCase().includes(q) ||
          link.student?.email?.toLowerCase().includes(q) ||
          link.relationship.toLowerCase().includes(q),
      );
    }

    if (relationshipFilter !== "all") {
      result = result.filter((link) => link.relationship === relationshipFilter);
    }

    if (selectedClassFilter !== "all") {
      result = result.filter((link) =>
        link.student?.enrollments?.some(
          (enr) => enr.class?.id === selectedClassFilter,
        ),
      );
    }

    return result;
  }, [parentStudentLinks, searchGuardians, relationshipFilter, selectedClassFilter]);

  // Open modal with pre-selected student
  const handleOpenLinkForStudent = (studentId: string) => {
    setLinkStudentId(studentId);
    setShowLinkModal(true);
  };

  // Handlers
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    try {
      setFeedback(null);
      setIsSubmitting(true);
      await schoolsApi.create({ name: schoolName.trim() });
      setSchoolName("");
      setShowCreateSchoolModal(false);
      setFeedback({ type: "success", message: "New school branch created successfully!" });
      refetchSchools();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to create school"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkParentStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkParentId || !linkStudentId) return;
    try {
      setFeedback(null);
      setIsSubmitting(true);
      await parentStudentsApi.link({
        parentId: linkParentId,
        studentId: linkStudentId,
        relationship: linkRelationship,
      });
      setLinkParentId("");
      setLinkStudentId("");
      setShowLinkModal(false);
      setFeedback({ type: "success", message: "Parent successfully linked to student!" });
      refetchLinks();
      refetchOverview();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to link parent and student"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlinkParentStudent = async (parentId: string, studentId: string) => {
    if (!confirm("Are you sure you want to remove this parent-student link?")) return;
    try {
      setFeedback(null);
      setIsSubmitting(true);
      await parentStudentsApi.unlink(parentId, studentId);
      setFeedback({ type: "success", message: "Parent-student link removed successfully." });
      refetchLinks();
      refetchOverview();
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Failed to unlink parent and student"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    isDemoMode,
    activeTab,
    setActiveTab,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    schoolDetails,
    isLoadingSchool,
    classesList,
    isLoadingClasses,
    parentStudentOverview,
    isLoadingOverview,
    parentStudentLinks,
    filteredLinks,
    isLoadingLinks,
    parentsList,
    studentsList,
    searchGuardians,
    setSearchGuardians,
    selectedClassFilter,
    setSelectedClassFilter,
    relationshipFilter,
    setRelationshipFilter,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    showCreateSchoolModal,
    setShowCreateSchoolModal,
    schoolName,
    setSchoolName,
    showLinkModal,
    setShowLinkModal,
    linkParentId,
    setLinkParentId,
    linkStudentId,
    setLinkStudentId,
    linkRelationship,
    setLinkRelationship,
    feedback,
    setFeedback,
    isSubmitting,
    handleCreateSchool,
    handleLinkParentStudent,
    handleUnlinkParentStudent,
    handleOpenLinkForStudent,
  };
}
