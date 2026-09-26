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
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  UserCheck,
  PlusCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { TeachingAssignment, Subject, Class } from "@/types";

interface TeachingAssignmentsGridProps {
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  assignments: TeachingAssignment[];
  subjects: Subject[];
  classes: Class[];
  search: string;
  onSearchChange: (value: string) => void;
  filterSubjectId: string;
  onFilterSubjectChange: (value: string) => void;
  filterClassId: string;
  onFilterClassChange: (value: string) => void;
  onAssignClick: () => void;
}

export function TeachingAssignmentsGrid({
  isLoading,
  isError,
  onRetry,
  assignments,
  subjects,
  classes,
  search,
  onSearchChange,
  filterSubjectId,
  onFilterSubjectChange,
  filterClassId,
  onFilterClassChange,
  onAssignClick,
}: TeachingAssignmentsGridProps) {
  const t = useTranslations("TeachingAssignments");

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-10 h-11 rounded-xl bg-card border-border/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <div className="relative min-w-[140px] sm:min-w-[160px]">
            <select
              value={filterSubjectId}
              onChange={(e) => onFilterSubjectChange(e.target.value)}
              className="w-full h-11 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-border/60 bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">{t("allSubjects")}</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="relative min-w-[130px] sm:min-w-[150px]">
            <select
              value={filterClassId}
              onChange={(e) => onFilterClassChange(e.target.value)}
              className="w-full h-11 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-border/60 bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">{t("allClasses")}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">{t("saving")}</span>
        </div>
      ) : isError ? (
        <Card className="rounded-2xl border-destructive/20 bg-destructive/5 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-destructive">
                Failed to load teaching assignments
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                An error occurred while fetching assignments. Please try again.
              </p>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-2 rounded-xl text-xs"
              >
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      ) : assignments.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/40 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                {t("noAssignmentsFound")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {t("noAssignmentsDesc")}
              </p>
            </div>
            <Button
              variant="role"
              size="sm"
              onClick={onAssignClick}
              className="mt-2 gap-2 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("assignTeacher")}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => {
            const teacherInitial =
              assignment.teacher?.name?.charAt(0).toUpperCase() || "T";
            const subjectCode = assignment.subject?.code || "SUB";
            const subjectName = assignment.subject?.name || "Subject";
            const className = assignment.class?.name || "Class";
            const ayName = assignment.academicYear?.name || "Academic Year";

            return (
              <Card
                key={assignment.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold line-clamp-1 text-foreground">
                          {subjectName}
                        </CardTitle>
                        <CardDescription className="text-xs font-mono font-medium text-muted-foreground">
                          {subjectCode}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="gap-1 font-semibold rounded-lg bg-background text-xs px-2 py-0.5"
                    >
                      <GraduationCap className="w-3 h-3 text-primary" />
                      {className}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3">
                  {/* Teacher Information */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {teacherInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {assignment.teacher?.name || "Unassigned"}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {assignment.teacher?.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Year & Status Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium text-[11px]">{ayName}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
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
