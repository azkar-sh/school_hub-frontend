import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Loader2, UserPlus, Search, GraduationCap, Users, ShieldCheck } from "lucide-react";
import { Class, ParentRelationship, User } from "@/types";

interface LinkGuardianModalProps {
  parents: User[];
  students: User[];
  classes?: Class[];
  linkParentId: string;
  onChangeLinkParentId: (val: string) => void;
  linkStudentId: string;
  onChangeLinkStudentId: (val: string) => void;
  linkRelationship: ParentRelationship;
  onChangeLinkRelationship: (val: ParentRelationship) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function LinkGuardianModal({
  parents,
  students,
  classes = [],
  linkParentId,
  onChangeLinkParentId,
  linkStudentId,
  onChangeLinkStudentId,
  linkRelationship,
  onChangeLinkRelationship,
  onSubmit,
  onClose,
  isSubmitting,
}: LinkGuardianModalProps) {
  const [parentSearch, setParentSearch] = React.useState("");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [selectedClassId, setSelectedClassId] = React.useState<string>("all");

  // Filter parents by search
  const filteredParents = React.useMemo(() => {
    if (!parentSearch.trim()) return parents;
    const q = parentSearch.toLowerCase();
    return parents.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q),
    );
  }, [parents, parentSearch]);

  // Filter students by class and search
  const filteredStudents = React.useMemo(() => {
    return students.filter((s) => {
      // Check class filter
      if (selectedClassId !== "all") {
        const studentEnrollments = (s as any).enrollments;
        if (Array.isArray(studentEnrollments)) {
          const hasClass = studentEnrollments.some(
            (enr: any) => enr.classId === selectedClassId || enr.class?.id === selectedClassId,
          );
          if (!hasClass) return false;
        }
      }

      // Check search query
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(q);
        const matchesEmail = s.email?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) return false;
      }

      return true;
    });
  }, [students, selectedClassId, studentSearch]);

  const preselectedStudent = React.useMemo(
    () => students.find((s) => s.id === linkStudentId),
    [students, linkStudentId],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Link Guardian to Student
              </h2>
              <p className="text-xs text-muted-foreground">
                Establish verified parental or guardian authority over a student ward.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Target Student Section */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>Student / Ward</span>
              </label>
              {preselectedStudent && (
                <button
                  type="button"
                  onClick={() => onChangeLinkStudentId("")}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Change Student
                </button>
              )}
            </div>

            {preselectedStudent ? (
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {preselectedStudent.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {preselectedStudent.email}
                  </p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-none text-[10px] shrink-0 font-semibold">
                  Selected
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {classes.length > 0 && (
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="h-9 px-2.5 rounded-xl border border-input bg-background text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="all">Filter: All Classes</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          Grade {cls.grade} - {cls.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search student..."
                      className="h-9 pl-8 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <select
                  value={linkStudentId}
                  onChange={(e) => onChangeLinkStudentId(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="">-- Choose Student ({filteredStudents.length} available) --</option>
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Parent Account Section */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-muted/30 border border-border/50">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>Parent / Guardian Account</span>
            </label>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={parentSearch}
                onChange={(e) => setParentSearch(e.target.value)}
                placeholder="Search parent by name or email..."
                className="h-9 pl-8 text-xs rounded-xl"
              />
            </div>

            <select
              value={linkParentId}
              onChange={(e) => onChangeLinkParentId(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">-- Choose Parent ({filteredParents.length} available) --</option>
              {filteredParents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Relationship Type</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "FATHER", label: "Ayah", sub: "Father" },
                { type: "MOTHER", label: "Ibu", sub: "Mother" },
                { type: "GUARDIAN", label: "Wali", sub: "Legal Guardian" },
              ].map((item) => {
                const isSelected = linkRelationship === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => onChangeLinkRelationship(item.type as ParentRelationship)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                        : "border-border/60 bg-card hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="role"
              disabled={isSubmitting || !linkParentId || !linkStudentId}
              className="rounded-xl font-semibold text-xs gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Linking...</span>
                </>
              ) : (
                <span>Confirm Guardian Link</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
