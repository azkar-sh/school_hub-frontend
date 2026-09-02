"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { getMockMembers, MockMember } from "@/lib/mock-data";
import { schoolsApi, usersApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { SchoolMember, UserRole } from "@/types";
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
  UserRound,
  UserPlus,
  Search,
  X,
  CheckCircle2,
  Loader2,
  Mail,
  School as SchoolIcon,
} from "lucide-react";

const ROLE_FILTERS: Array<{ label: string; value: "ALL" | UserRole }> = [
  { label: "All", value: "ALL" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
  { label: "Parent", value: "PARENT" },
];

export default function MembersPage() {
  const { isDemoMode } = useAuthStore();

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | UserRole>("ALL");
  const [selectedMember, setSelectedMember] = React.useState<MockMember | null>(
    null,
  );

  // School selection is cached & shared across all dashboard pages.
  // Admin can manage members of any school, so we list all schools.
  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    isLoading,
  } = useSchoolSelection({ fetchAllForAdmin: true });

  const { data: usersData } = useFetchData(
    () => usersApi.findAll({ limit: 100 }).then((res) => (Array.isArray(res.data) ? res.data : [])),
    [],
    !isDemoMode,
  );
  const usersList = usersData ?? [];

  const { data: membersData, refetch: refetchMembers } = useFetchData(
    () => schoolsApi.getMembers(selectedSchoolId).then((res) => (Array.isArray(res.data) ? res.data : [])),
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

  const filtered = displayMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            School Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage teachers, students, and parents in your school
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isDemoMode && schools.length > 0 && (
            <select
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <Button
            variant="role"
            className="shadow-md"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Role Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {ROLE_FILTERS.map((rf) => (
              <Button
                key={rf.value}
                variant={roleFilter === rf.value ? "role" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(rf.value)}
                className="text-xs"
              >
                {rf.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading members…</span>
        </div>
      )}

      {/* Member List */}
      {(!isLoading || isDemoMode) && (
        <Card>
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-base">
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
            <CardDescription className="text-xs">
              All affiliated teachers, students, and parents
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 p-0">
            {filtered.length === 0 ? (
              <div className="py-14 text-center text-sm text-muted-foreground">
                No members match your search.
              </div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sm text-foreground">
                        {m.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {m.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 capitalize text-xs"
                  >
                    {m.role.toLowerCase().replace("_", " ")}
                  </Badge>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Member Detail</CardTitle>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedMember.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Role
                </p>
                <Badge variant="role" className="capitalize">
                  {selectedMember.role.toLowerCase().replace("_", " ")}
                </Badge>
              </div>

              {/* School Membership */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  School Membership
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <SchoolIcon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    {selectedMember.schoolName}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Add School Member</CardTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
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
                      placeholder={isDemoMode ? "User UUID" : "Paste User UUID"}
                      value={memberUserId}
                      onChange={(e) => setMemberUserId(e.target.value)}
                      required
                    />
                  )}
                </div>
                <Button type="submit" variant="role" className="w-full">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add to School
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
