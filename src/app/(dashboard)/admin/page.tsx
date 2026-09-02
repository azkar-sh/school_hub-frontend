"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import {
  schoolsApi,
  academicYearsApi,
  teachingAssignmentsApi,
  usersApi,
  parentStudentsApi,
} from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import {
  AcademicYear,
  TeachingAssignment,
  User,
  ParentRelationship,
  SchoolMember,
} from "@/types";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Users,
  UserPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default function AdminPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // Active Tab State
  const [activeTab, setActiveTab] = React.useState<
    "schools" | "academicYears" | "members" | "assignments" | "parents"
  >("schools");

  // State
  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    refetch: refetchSchools,
  } = useSchoolSelection({ fetchAllForAdmin: true });
  const [assignments, setAssignments] = React.useState<TeachingAssignment[]>(
    [],
  );

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

  // Teaching Assignment Form
  const [assignTeacherId, setAssignTeacherId] = React.useState("");
  const [assignSubjectId, setAssignSubjectId] = React.useState("");
  const [assignClassId, setAssignClassId] = React.useState("");
  const [assignAyId, setAssignAyId] = React.useState("");

  // Parent-Student Link Form
  const [linkParentId, setLinkParentId] = React.useState("");
  const [linkStudentId, setLinkStudentId] = React.useState("");
  const [linkRelationship, setLinkRelationship] =
    React.useState<ParentRelationship>("FATHER");

  // Demo Fallback Data
  const demoAcademicYears: AcademicYear[] = [
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

  // Fetch academic years via hook
  const { data: academicYearsData, refetch: refetchAcademicYears } = useFetchData(
    () => academicYearsApi.findBySchool(selectedSchoolId).then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const academicYears = isDemoMode ? demoAcademicYears : (academicYearsData ?? []);

  // Mutation loading state (for form submit buttons — used in event handlers, NOT effects)
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch school members via hook
  const { data: membersData, refetch: refetchMembers } = useFetchData(
    () => schoolsApi.getMembers(selectedSchoolId).then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );
  const schoolMembers = (membersData ?? []) as SchoolMember[];

  // Fetch users via hook
  const { data: usersData } = useFetchData(
    () => usersApi.findAll({ limit: 100 }).then((res) => (Array.isArray(res.data) ? res.data : [])),
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

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="role" className="gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              School Administration
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            School & Academic Operations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage institution profiles, academic terms, staff & student
            memberships
          </p>
        </div>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-2">
        <Button
          variant={activeTab === "schools" ? "role" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("schools")}
          className="gap-2 text-xs"
        >
          <Building2 className="w-4 h-4" />
          Schools ({schools.length})
        </Button>
        <Button
          variant={activeTab === "academicYears" ? "role" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("academicYears")}
          className="gap-2 text-xs"
        >
          <Calendar className="w-4 h-4" />
          Academic Years ({academicYears.length})
        </Button>
        <Button
          variant={activeTab === "members" ? "role" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("members")}
          className="gap-2 text-xs"
        >
          <Users className="w-4 h-4" />
          School Members
        </Button>
        <Button
          variant={activeTab === "parents" ? "role" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("parents")}
          className="gap-2 text-xs"
        >
          <UserPlus className="w-4 h-4" />
          Link Parent-Student
        </Button>
      </div>

      {/* TAB 1: SCHOOLS */}
      {activeTab === "schools" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>Add New School</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Create an institution profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSchool} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    School Name
                  </label>
                  <Input
                    placeholder="e.g. SMA Garuda Hope"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="role"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create School
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Registered Schools</CardTitle>
              <CardDescription className="text-xs">
                Select a school to configure academic terms and members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schools.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No schools created yet. Use the form on the left to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {schools.map((sch) => (
                    <div
                      key={sch.id}
                      onClick={() => setSelectedSchoolId(sch.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedSchoolId === sch.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/60 bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {sch.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            ID: {sch.id}
                          </p>
                        </div>
                      </div>
                      {selectedSchoolId === sch.id && (
                        <Badge variant="role" className="text-[10px]">
                          Active Context
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: ACADEMIC YEARS */}
      {activeTab === "academicYears" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Create Academic Year</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure calendar term dates for school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAcademicYear} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Select School
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose School --</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Academic Year Name
                  </label>
                  <Input
                    placeholder="e.g. 2026/2027"
                    value={ayName}
                    onChange={(e) => setAyName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={ayStartsAt}
                    onChange={(e) => setAyStartsAt(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={ayEndsAt}
                    onChange={(e) => setAyEndsAt(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="role"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Save Academic Year
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Academic Terms History</CardTitle>
              <CardDescription className="text-xs">
                Terms configured for target school
              </CardDescription>
            </CardHeader>
            <CardContent>
              {academicYears.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No academic years found for selected school.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {academicYears.map((ay) => (
                    <div
                      key={ay.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-foreground">
                          {ay.name}
                        </h4>
                        <Badge variant={ay.isActive ? "role" : "outline"}>
                          {ay.isActive ? "Active" : "Closed"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          Starts: {new Date(ay.startsAt).toLocaleDateString()}
                        </p>
                        <p>Ends: {new Date(ay.endsAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SCHOOL MEMBERS */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Add School Member</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Associate a registered user with a school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Select School
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose School --</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Select User or Enter User ID
                  </label>
                  {usersList.length > 0 ? (
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                      value={memberUserId}
                      onChange={(e) => setMemberUserId(e.target.value)}
                      required
                    >
                      <option value="">-- Select User --</option>
                      {usersList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role}) - {u.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      placeholder="Paste User UUID"
                      value={memberUserId}
                      onChange={(e) => setMemberUserId(e.target.value)}
                      required
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  variant="role"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add to School
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">School Roster & Members</CardTitle>
              <CardDescription className="text-xs">
                All affiliated teachers, students, and staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schoolMembers.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No registered members found for this school yet.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {schoolMembers.map((m) => (
                    <div
                      key={m.id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground">
                          {m.user?.name || "User"}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({m.user?.email || m.userId})
                        </span>
                      </div>
                      <Badge variant="outline">
                        {m.user?.role || "MEMBER"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: PARENT-STUDENT LINKS */}
      {activeTab === "parents" && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <span>Link Parent to Student Ward</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Establish relationship link between Parent account and Student
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLinkParentStudent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Parent User
                </label>
                {usersList.length > 0 ? (
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                    value={linkParentId}
                    onChange={(e) => setLinkParentId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Parent User --</option>
                    {usersList
                      .filter((u) => u.role === "PARENT")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                ) : (
                  <Input
                    placeholder="Parent User UUID"
                    value={linkParentId}
                    onChange={(e) => setLinkParentId(e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Student User
                </label>
                {usersList.length > 0 ? (
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                    value={linkStudentId}
                    onChange={(e) => setLinkStudentId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Student User --</option>
                    {usersList
                      .filter((u) => u.role === "STUDENT")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                ) : (
                  <Input
                    placeholder="Student User UUID"
                    value={linkStudentId}
                    onChange={(e) => setLinkStudentId(e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Relationship Type
                </label>
                <select
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                  value={linkRelationship}
                  onChange={(e) =>
                    setLinkRelationship(e.target.value as ParentRelationship)
                  }
                  required
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Guardian</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="role"
                className="w-full"
                isLoading={isLoading}
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Link Parent & Student
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
