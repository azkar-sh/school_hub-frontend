"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockClasses } from "@/lib/mock-data";
import {
  classesApi,
  academicYearsApi,
  usersApi,
} from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { getErrorMessage } from "@/lib/errors";
import { Class, AcademicYear, User } from "@/types";
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
  School as SchoolIcon,
  Users,
  GraduationCap,
  BookmarkCheck,
  PlusCircle,
  UserPlus,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ClassesPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // School selection is cached & shared across all dashboard pages
  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
  } = useSchoolSelection();
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
  const { data: classesData, isLoading, refetch: refetchClasses } = useFetchData(
    () =>
      classesApi
        .findBySchool(selectedSchoolId, selectedAyId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId, selectedAyId],
    !isDemoMode && !!selectedSchoolId,
  );
  const classesList = (classesData ?? []) as Class[];

  // Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !selectedAyId || !classNameInput.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Class created in demo mode");
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
      setFeedbackMsg("Class created successfully!");
      refetchClasses();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create class"));
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrollClassId || !selectedAyId || !enrollStudentId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Student enrolled in demo mode");
        setActiveEnrollClassId(null);
        return;
      }
      await classesApi.enrollStudent(activeEnrollClassId, {
        studentId: enrollStudentId,
        academicYearId: selectedAyId,
      });
      setEnrollStudentId("");
      setActiveEnrollClassId(null);
      setFeedbackMsg("Student enrolled successfully!");
      if (selectedSchoolId) refetchClasses();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to enroll student"));
    }
  };

  const handleAssignHomeroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHomeroomClassId || !selectedAyId || !homeroomTeacherId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Homeroom teacher assigned in demo mode");
        setActiveHomeroomClassId(null);
        return;
      }
      await classesApi.assignHomeroom(activeHomeroomClassId, {
        teacherId: homeroomTeacherId,
        academicYearId: selectedAyId,
      });
      setHomeroomTeacherId("");
      setActiveHomeroomClassId(null);
      setFeedbackMsg("Homeroom teacher assigned successfully!");
      if (selectedSchoolId) refetchClasses();
    } catch (error) {
      setFeedbackMsg(
        getErrorMessage(error, "Failed to assign homeroom teacher"),
      );
    }
  };

  // Demo classes fallback
  const mockClasses = getMockClasses(currentRole);

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Classes & Enrollment Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentRole === "SCHOOL_ADMIN" || currentRole === "TEACHER"
              ? "Manage school class sections, student enrollments, and homeroom assignments"
              : "View your class section details and homeroom teacher"}
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

          {(currentRole === "SCHOOL_ADMIN" || currentRole === "TEACHER") && (
            <Button
              variant="role"
              className="shadow-md"
              onClick={() => setShowCreateClassModal(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Class
            </Button>
          )}
        </div>
      </div>

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

      {/* Demo Mode Mock Display */}
      {isDemoMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockClasses.map((cls) => (
            <Card
              key={cls.id}
              className={`hover:border-primary/50 transition-all ${
                cls.isCurrentStudentClass
                  ? "border-primary/40 bg-primary/5"
                  : ""
              }`}
            >
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  {cls.isCurrentStudentClass && (
                    <Badge variant="role" className="mb-2 gap-1">
                      <BookmarkCheck className="w-3 h-3" />
                      {currentRole === "PARENT"
                        ? "Child's Class"
                        : "Your Class"}
                    </Badge>
                  )}
                  {!cls.isCurrentStudentClass && (
                    <Badge variant="role" className="mb-2">
                      Grade {cls.grade}
                    </Badge>
                  )}
                  <CardTitle className="text-xl">{cls.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Academic Year: {cls.academicYear}
                  </CardDescription>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <SchoolIcon className="w-6 h-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 text-sm border-t border-border/40 mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    Homeroom: {cls.homeroomTeacher}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <Users className="w-4 h-4 text-indigo-500" />
                    {cls.studentsCount} Students
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Real Backend Data Display */}
      {!isDemoMode && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading classes…</span>
            </div>
          ) : classesList.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground text-sm">
              No classes created for this school yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {classesList.map((cls) => {
                const homeroom =
                  cls.homeroomAssignments?.[0]?.teacher?.name || "Unassigned";
                const enrollmentsCount = cls.enrollments?.length || 0;

                return (
                  <Card
                    key={cls.id}
                    className="hover:border-primary/50 transition-all"
                  >
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                      <div>
                        <Badge variant="role" className="mb-2">
                          Grade {cls.grade}
                        </Badge>
                        <CardTitle className="text-xl">{cls.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Academic Year:{" "}
                          {cls.academicYear?.name || selectedAyId}
                        </CardDescription>
                      </div>
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <SchoolIcon className="w-6 h-6" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2 text-sm border-t border-border/40 mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium">
                          <GraduationCap className="w-4 h-4 text-emerald-500" />
                          Homeroom: {homeroom}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-foreground">
                          <Users className="w-4 h-4 text-indigo-500" />
                          {enrollmentsCount} Enrolled
                        </span>
                      </div>

                      {(currentRole === "SCHOOL_ADMIN" ||
                        currentRole === "TEACHER") && (
                        <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 flex-1"
                            onClick={() => setActiveEnrollClassId(cls.id)}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Enroll Student
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 flex-1"
                            onClick={() => setActiveHomeroomClassId(cls.id)}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            Assign Homeroom
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal: Create Class */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Create New Class</CardTitle>
              <button
                onClick={() => setShowCreateClassModal(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Class Name
                  </label>
                  <Input
                    placeholder="e.g. 8A"
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Grade Level
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={classGradeInput}
                    onChange={(e) => setClassGradeInput(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Academic Year
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                    value={selectedAyId}
                    onChange={(e) => setSelectedAyId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Academic Year --</option>
                    {academicYears.map((ay) => (
                      <option key={ay.id} value={ay.id}>
                        {ay.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Create Class Section
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Enroll Student */}
      {activeEnrollClassId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Enroll Student into Class
              </CardTitle>
              <button
                onClick={() => setActiveEnrollClassId(null)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnrollStudent} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Select Student
                  </label>
                  {usersList.length > 0 ? (
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                      value={enrollStudentId}
                      onChange={(e) => setEnrollStudentId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Student --</option>
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
                      placeholder="Student UUID"
                      value={enrollStudentId}
                      onChange={(e) => setEnrollStudentId(e.target.value)}
                      required
                    />
                  )}
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Confirm Enrollment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Assign Homeroom Teacher */}
      {activeHomeroomClassId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Assign Homeroom Teacher</CardTitle>
              <button
                onClick={() => setActiveHomeroomClassId(null)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignHomeroom} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Select Teacher
                  </label>
                  {usersList.length > 0 ? (
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                      value={homeroomTeacherId}
                      onChange={(e) => setHomeroomTeacherId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Teacher --</option>
                      {usersList
                        .filter((u) => u.role === "TEACHER")
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <Input
                      placeholder="Teacher UUID"
                      value={homeroomTeacherId}
                      onChange={(e) => setHomeroomTeacherId(e.target.value)}
                      required
                    />
                  )}
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Assign Homeroom Teacher
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
