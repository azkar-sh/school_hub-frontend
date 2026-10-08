import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HeartHandshake,
  Search,
  UserPlus,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  LayoutList,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import {
  Class,
  ClassGuardianshipOverview,
  ParentRelationship,
  ParentStudent,
  ParentStudentOverviewResponse,
  StudentWithGuardians,
  User,
} from "@/types";

interface GuardianshipTabProps {
  links: ParentStudent[];
  totalParents: number;
  totalStudents: number;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenLinkModal: () => void;
  onUnlink: (parentId: string, studentId: string) => void;
  isLoading: boolean;
  overview?: ParentStudentOverviewResponse | null;
  classesList?: Class[];
  selectedClassFilter?: string;
  onClassFilterChange?: (classId: string) => void;
  relationshipFilter?: string;
  onRelationshipFilterChange?: (rel: string) => void;
  statusFilter?: "all" | "linked" | "unlinked";
  onStatusFilterChange?: (status: "all" | "linked" | "unlinked") => void;
  viewMode?: "accordion" | "flat";
  onViewModeChange?: (mode: "accordion" | "flat") => void;
  onQuickLinkStudent?: (studentId: string) => void;
}

export function GuardianshipTab({
  links,
  totalParents,
  totalStudents,
  search,
  onSearchChange,
  onOpenLinkModal,
  onUnlink,
  isLoading,
  overview,
  classesList = [],
  selectedClassFilter = "all",
  onClassFilterChange,
  relationshipFilter = "all",
  onRelationshipFilterChange,
  statusFilter = "all",
  onStatusFilterChange,
  viewMode = "accordion",
  onViewModeChange,
  onQuickLinkStudent,
}: GuardianshipTabProps) {
  // Accordion open/close state map (classId -> boolean)
  const [openClasses, setOpenClasses] = React.useState<Record<string, boolean>>({});

  const toggleClass = (classId: string) => {
    setOpenClasses((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const getRelationshipBadge = (rel: ParentRelationship) => {
    switch (rel) {
      case "FATHER":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold text-[11px] px-2 py-0.5">
            Ayah (Father)
          </Badge>
        );
      case "MOTHER":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold text-[11px] px-2 py-0.5">
            Ibu (Mother)
          </Badge>
        );
      case "GUARDIAN":
      default:
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-[11px] px-2 py-0.5">
            Wali (Guardian)
          </Badge>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Active";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  // Compute metrics from overview or links
  const summary = React.useMemo(() => {
    if (overview?.summary) {
      return overview.summary;
    }
    const distinctParents = new Set(links.map((l) => l.parentId)).size;
    const distinctStudents = new Set(links.map((l) => l.studentId)).size;
    const computedTotalParents = totalParents > 0 ? totalParents : distinctParents;
    const computedTotalStudents = totalStudents > 0 ? totalStudents : distinctStudents;
    const linkedStudentsCount = distinctStudents;
    const unlinkedStudentsCount = Math.max(0, computedTotalStudents - linkedStudentsCount);
    const coverage =
      computedTotalStudents > 0
        ? Math.round((linkedStudentsCount / computedTotalStudents) * 100)
        : 0;

    return {
      totalParents: computedTotalParents,
      totalStudents: computedTotalStudents,
      totalLinkedStudents: linkedStudentsCount,
      totalUnlinkedStudents: unlinkedStudentsCount,
      totalRelationships: links.length,
      coveragePercentage: coverage,
    };
  }, [overview, links, totalParents, totalStudents]);

  // Classes data with student filtering applied
  const filteredOverviewClasses = React.useMemo(() => {
    if (!overview?.classes) return [];

    let result = overview.classes;

    // Filter by class dropdown
    if (selectedClassFilter !== "all") {
      result = result.filter((cls) => cls.id === selectedClassFilter);
    }

    // Filter students within each class based on search, relationship, and status
    return result
      .map((cls) => {
        let students = cls.students;

        // Search query filter
        if (search.trim()) {
          const q = search.toLowerCase();
          students = students.filter(
            (st) =>
              st.name.toLowerCase().includes(q) ||
              st.email.toLowerCase().includes(q) ||
              st.guardians.some(
                (g) =>
                  g.name.toLowerCase().includes(q) ||
                  g.email.toLowerCase().includes(q),
              ),
          );
        }

        // Relationship filter
        if (relationshipFilter !== "all") {
          students = students.filter((st) =>
            st.guardians.some((g) => g.relationship === relationshipFilter),
          );
        }

        // Status filter: linked vs unlinked
        if (statusFilter === "linked") {
          students = students.filter((st) => st.guardians.length > 0);
        } else if (statusFilter === "unlinked") {
          students = students.filter((st) => st.guardians.length === 0);
        }

        const filteredLinkedCount = students.filter(
          (s) => s.guardians.length > 0,
        ).length;

        return {
          ...cls,
          students,
          filteredTotal: students.length,
          filteredLinkedCount,
        };
      })
      .filter((cls) => cls.students.length > 0 || (search === "" && relationshipFilter === "all" && statusFilter === "all"));
  }, [overview, selectedClassFilter, search, relationshipFilter, statusFilter]);

  // Filtered Unassigned Students
  const filteredUnassignedStudents = React.useMemo(() => {
    if (!overview?.unassignedStudents) return [];
    if (selectedClassFilter !== "all") return [];

    let students = overview.unassignedStudents;

    if (search.trim()) {
      const q = search.toLowerCase();
      students = students.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          st.email.toLowerCase().includes(q) ||
          st.guardians.some(
            (g) =>
              g.name.toLowerCase().includes(q) ||
              g.email.toLowerCase().includes(q),
          ),
      );
    }

    if (relationshipFilter !== "all") {
      students = students.filter((st) =>
        st.guardians.some((g) => g.relationship === relationshipFilter),
      );
    }

    if (statusFilter === "linked") {
      students = students.filter((st) => st.guardians.length > 0);
    } else if (statusFilter === "unlinked") {
      students = students.filter((st) => st.guardians.length === 0);
    }

    return students;
  }, [overview, selectedClassFilter, search, relationshipFilter, statusFilter]);

  // Helper to expand all / collapse all
  const handleToggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    filteredOverviewClasses.forEach((cls) => {
      newState[cls.id] = expand;
    });
    if (filteredUnassignedStudents.length > 0) {
      newState["unassigned"] = expand;
    }
    setOpenClasses(newState);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedClassFilter !== "all" ||
    relationshipFilter !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    onSearchChange("");
    onClassFilterChange?.("all");
    onRelationshipFilterChange?.("all");
    onStatusFilterChange?.("all");
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parents */}
        <Card className="rounded-2xl border border-border/60 bg-card p-4 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Parents
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {summary.totalParents}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Registered parent accounts
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Total Students */}
        <Card className="rounded-2xl border border-border/60 bg-card p-4 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Students
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {summary.totalStudents}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Active student enrollment
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Guardian Coverage */}
        <Card className="rounded-2xl border border-border/60 bg-card p-4 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Guardian Coverage
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-foreground">
                  {summary.coveragePercentage}%
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {summary.totalLinkedStudents}/{summary.totalStudents} Linked
                </span>
              </div>
              <div className="w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, summary.coveragePercentage)}%` }}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Missing Guardian / Action Needed */}
        <Card
          onClick={() => onStatusFilterChange?.(statusFilter === "unlinked" ? "all" : "unlinked")}
          className={`rounded-2xl border p-4 transition-all cursor-pointer ${
            summary.totalUnlinkedStudents > 0
              ? statusFilter === "unlinked"
                ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30"
                : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
              : "border-border/60 bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>Needs Guardian</span>
                {statusFilter === "unlinked" && (
                  <span className="text-[9px] lowercase bg-amber-500/20 px-1.5 rounded-md">active</span>
                )}
              </p>
              <h3 className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">
                {summary.totalUnlinkedStudents}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {summary.totalUnlinkedStudents > 0
                  ? "Students missing contact"
                  : "All students have guardians!"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              {summary.totalUnlinkedStudents > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Interactive Search & Multi-Filter Bar */}
      <Card className="rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student, parent, email, or relationship..."
              className="pl-10 pr-9 h-10 rounded-xl bg-muted/40 border-border/60 text-xs sm:text-sm focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Class */}
            <select
              value={selectedClassFilter}
              onChange={(e) => onClassFilterChange?.(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border/60 bg-muted/40 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Classes</option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Grade {cls.grade} - {cls.name}
                </option>
              ))}
            </select>

            {/* Filter by Relationship */}
            <select
              value={relationshipFilter}
              onChange={(e) => onRelationshipFilterChange?.(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border/60 bg-muted/40 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Relationships</option>
              <option value="FATHER">Ayah (Father)</option>
              <option value="MOTHER">Ibu (Mother)</option>
              <option value="GUARDIAN">Wali (Guardian)</option>
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange?.(e.target.value as "all" | "linked" | "unlinked")
              }
              className="h-10 px-3 rounded-xl border border-border/60 bg-muted/40 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="linked">Linked Only</option>
              <option value="unlinked">Needs Guardian (!)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => onViewModeChange?.("accordion")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "accordion"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Class Accordion View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">By Class</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange?.("flat")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "flat"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Flat Directory View"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flat List</span>
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-10 px-2.5 text-xs text-muted-foreground hover:text-destructive rounded-xl"
              >
                Reset
              </Button>
            )}

            {/* Primary Action Button */}
            <Button
              variant="role"
              onClick={onOpenLinkModal}
              className="h-10 gap-2 rounded-xl shadow-md font-semibold text-xs sm:text-sm shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Link Guardian</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Main Content: Accordion View vs Flat View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">
            Loading class & guardian directory...
          </span>
        </div>
      ) : viewMode === "accordion" && filteredOverviewClasses.length > 0 ? (
        /* ACCORDION BY CLASS VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="font-semibold">
              Showing {filteredOverviewClasses.length} class
              {filteredOverviewClasses.length > 1 ? "es" : ""}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleAll(true)}
                className="hover:text-primary transition-colors font-medium"
              >
                Expand All
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleToggleAll(false)}
                className="hover:text-primary transition-colors font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredOverviewClasses.map((cls) => {
            const isOpen = openClasses[cls.id] ?? true; // Default open for convenient viewing
            const total = cls.totalStudents;
            const linked = cls.linkedCount;
            const unlinked = total - linked;
            const pct = total > 0 ? Math.round((linked / total) * 100) : 0;

            return (
              <Card
                key={cls.id}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:border-border transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleClass(cls.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors select-none border-b border-border/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-foreground transition-transform" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-foreground transition-transform" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-0.5">
                          Grade {cls.grade}
                        </Badge>
                        <h4 className="text-base font-bold text-foreground truncate">
                          {cls.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cls.students.length} student{cls.students.length !== 1 ? "s" : ""}{" "}
                        enrolled
                      </p>
                    </div>
                  </div>

                  {/* Coverage Progress in Header */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-foreground">
                          {linked}/{total} Linked
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            pct === 100
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          ({pct}%)
                        </span>
                      </div>
                      <div className="w-32 bg-muted/80 rounded-full h-2 mt-1 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            pct === 100 ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {unlinked > 0 ? (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                        {unlinked} Unlinked
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        100% Complete
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isOpen && (
                  <CardContent className="p-4 sm:p-5 bg-card/50">
                    {cls.students.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No students match the selected filter in this class.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {cls.students.map((student) => {
                          const isLinked = student.guardians.length > 0;
                          const studentInitial =
                            student.name?.charAt(0).toUpperCase() || "S";

                          return (
                            <div
                              key={student.id}
                              className={`p-3.5 rounded-2xl border transition-all ${
                                isLinked
                                  ? "bg-card border-border/60 hover:border-primary/40 hover:shadow-sm"
                                  : "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50"
                              }`}
                            >
                              {/* Student Info */}
                              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                                      isLinked
                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                    }`}
                                  >
                                    {studentInitial}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">
                                      {student.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground truncate">
                                      {student.email}
                                    </p>
                                  </div>
                                </div>

                                {!isLinked && (
                                  <Button
                                    variant="role"
                                    size="sm"
                                    onClick={() => onQuickLinkStudent?.(student.id)}
                                    className="h-7 px-2.5 text-[11px] font-semibold rounded-lg gap-1 shrink-0"
                                  >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Link Guardian</span>
                                  </Button>
                                )}
                              </div>

                              {/* Guardians List */}
                              <div className="pt-2.5 space-y-2">
                                {isLinked ? (
                                  student.guardians.map((g) => (
                                    <div
                                      key={g.id}
                                      className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/40 text-xs"
                                    >
                                      <div className="min-w-0 flex-1 mr-2">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          {getRelationshipBadge(g.relationship)}
                                          <span className="font-semibold text-foreground truncate">
                                            {g.name}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground truncate pl-0.5">
                                          {g.email}
                                        </p>
                                      </div>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onUnlink(g.id, student.id)}
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                                        title="Unlink guardian"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  ))
                                ) : (
                                  <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    <span>No guardian linked to this student yet</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Unassigned Students Section */}
          {filteredUnassignedStudents.length > 0 && (
            <Card className="rounded-2xl border border-dashed border-border/80 bg-card overflow-hidden shadow-sm">
              <div
                onClick={() => toggleClass("unassigned")}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 select-none border-b border-border/40"
              >
                <div className="flex items-center gap-3">
                  {openClasses["unassigned"] ? (
                    <ChevronDown className="w-5 h-5 text-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Unassigned / Transfer Students
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Students registered in this campus without a specific homeroom class
                    </p>
                  </div>
                </div>

                <Badge className="bg-muted text-muted-foreground border text-xs">
                  {filteredUnassignedStudents.length} students
                </Badge>
              </div>

              {(openClasses["unassigned"] ?? true) && (
                <CardContent className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredUnassignedStudents.map((student) => {
                      const isLinked = student.guardians.length > 0;
                      return (
                        <div
                          key={student.id}
                          className="p-3.5 rounded-2xl border border-border/60 bg-card space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-foreground">
                                {student.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                            {!isLinked && (
                              <Button
                                variant="role"
                                size="sm"
                                onClick={() => onQuickLinkStudent?.(student.id)}
                                className="h-7 px-2.5 text-xs font-semibold rounded-lg"
                              >
                                Link Guardian
                              </Button>
                            )}
                          </div>
                          {isLinked && (
                            <div className="space-y-1.5 pt-1 border-t border-border/40">
                              {student.guardians.map((g) => (
                                <div
                                  key={g.id}
                                  className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-muted/40"
                                >
                                  <div className="flex items-center gap-1.5">
                                    {getRelationshipBadge(g.relationship)}
                                    <span className="font-semibold">{g.name}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onUnlink(g.id, student.id)}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      ) : links.length === 0 ? (
        /* EMPTY STATE */
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/40 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                No Guardian Records Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {hasActiveFilters
                  ? "No results matched your search or filter settings. Try adjusting or resetting the filters."
                  : "Connect parent accounts with their student wards so parents can monitor attendance, assignments, and grades."}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-2 rounded-xl"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="role"
                size="sm"
                onClick={onOpenLinkModal}
                className="mt-2 gap-2 rounded-xl"
              >
                <UserPlus className="w-4 h-4" />
                <span>Link Guardian to Student</span>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* FLAT DIRECTORY VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => {
            const parentInitial = link.parent?.name?.charAt(0).toUpperCase() || "P";
            const studentInitial = link.student?.name?.charAt(0).toUpperCase() || "S";
            const studentEnrollment = link.student?.enrollments?.[0]?.class;

            return (
              <Card
                key={`${link.parentId}-${link.studentId}`}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <CardHeader className="p-4 pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Guardianship Relation
                      </span>
                      {studentEnrollment && (
                        <Badge className="bg-muted text-muted-foreground border text-[10px] px-1.5 py-0">
                          Grade {studentEnrollment.grade} - {studentEnrollment.name}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getRelationshipBadge(link.relationship)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnlink(link.parentId, link.studentId)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Unlink relationship"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Parent Info */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Parent / Guardian
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {parentInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {link.parent?.name || "Parent Account"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {link.parent?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Student / Ward
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {studentInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {link.student?.name || "Student Account"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {link.student?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      Linked on {formatDate(link.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Record
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
