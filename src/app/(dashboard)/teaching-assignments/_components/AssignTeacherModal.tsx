import * as React from "react";
import { Button } from "@/components/ui/button";
import { Subject, Class, AcademicYear, User } from "@/types";
import { X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface AssignTeacherModalProps {
  teachers: User[];
  subjects: Subject[];
  classes: Class[];
  academicYears: AcademicYear[];
  teacherId: string;
  onChangeTeacherId: (id: string) => void;
  subjectId: string;
  onChangeSubjectId: (id: string) => void;
  classId: string;
  onChangeClassId: (id: string) => void;
  academicYearId: string;
  onChangeAcademicYearId: (id: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AssignTeacherModal({
  teachers,
  subjects,
  classes,
  academicYears,
  teacherId,
  onChangeTeacherId,
  subjectId,
  onChangeSubjectId,
  classId,
  onChangeClassId,
  academicYearId,
  onChangeAcademicYearId,
  isSubmitting,
  onClose,
  onSubmit,
}: AssignTeacherModalProps) {
  const t = useTranslations("TeachingAssignments");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {t("createNewAssignment")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("description")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block text-foreground">
              {t("teacher")}
            </label>
            <select
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={teacherId}
              onChange={(e) => onChangeTeacherId(e.target.value)}
              required
            >
              <option value="">{t("selectTeacher")}</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block text-foreground">
              {t("subject")}
            </label>
            <select
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={subjectId}
              onChange={(e) => onChangeSubjectId(e.target.value)}
              required
            >
              <option value="">{t("selectSubject")}</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block text-foreground">
                {t("class")}
              </label>
              <select
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={classId}
                onChange={(e) => onChangeClassId(e.target.value)}
                required
              >
                <option value="">{t("selectClass")}</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.name} (Grade {c.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block text-foreground">
                {t("academicYear")}
              </label>
              <select
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={academicYearId}
                onChange={(e) => onChangeAcademicYearId(e.target.value)}
                required
              >
                <option value="">{t("selectAcademicYear")}</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.isActive ? "— Active" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="role"
              disabled={isSubmitting}
              className="rounded-xl gap-2 min-w-32 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{t("submitAssignment")}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
