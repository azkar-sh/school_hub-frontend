import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  School as SchoolIcon,
  Users,
  GraduationCap,
  UserPlus,
  Crown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Class } from "@/types";

interface ClassesGridProps {
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  classes: Class[];
  selectedAyId: string;
  currentRole: string;
  currentUserId?: string;
  canManageClasses: boolean;
  onViewStudents: (classId: string) => void;
  onEnrollStudent: (classId: string) => void;
  onAssignHomeroom: (classId: string) => void;
}

export function ClassesGrid({
  isLoading,
  isError,
  onRetry,
  classes,
  selectedAyId,
  currentRole,
  currentUserId,
  canManageClasses,
  onViewStudents,
  onEnrollStudent,
  onAssignHomeroom,
}: ClassesGridProps) {
  const t = useTranslations("Classes");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{t("loadingClasses")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="py-12 text-center text-sm border-destructive/20 bg-destructive/5 space-y-3">
        <div className="text-destructive font-medium">Failed to load classes</div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="h-8 text-xs">
            Try Again
          </Button>
        )}
      </Card>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="py-12 text-center text-muted-foreground text-sm">
        {t("noClassesForSchool")}
      </Card>
    );
  }

  const isTeacher = currentRole === "TEACHER";

  const isAssignedToTeacher = (cls: Class) =>
    (cls.teachingAssignments?.length ?? 0) > 0 ||
    !!cls.homeroomAssignments?.some((h) => h.teacherId === currentUserId);

  const isHomeroomOfTeacher = (cls: Class) =>
    !!cls.homeroomAssignments?.some((h) => h.teacherId === currentUserId);

  if (isTeacher) {
    const myClasses = classes.filter(isAssignedToTeacher);
    const myClassIds = new Set(myClasses.map((c) => c.id));
    const otherClasses = classes.filter((c) => !myClassIds.has(c.id));

    return (
      <div className="space-y-8">
        <ClassSection
          title={t("myClasses")}
          subtitle={t("classesYouTeachDesc")}
          classes={myClasses}
          selectedAyId={selectedAyId}
          currentUserId={currentUserId}
          canManageClasses={canManageClasses}
          onViewStudents={onViewStudents}
          onEnrollStudent={onEnrollStudent}
          onAssignHomeroom={onAssignHomeroom}
          isHomeroomOf={isHomeroomOfTeacher}
          clickable
        />
        <ClassSection
          title={t("otherClasses")}
          subtitle={t("otherClassesDesc")}
          classes={otherClasses}
          selectedAyId={selectedAyId}
          currentUserId={currentUserId}
          canManageClasses={canManageClasses}
          onViewStudents={onViewStudents}
          onEnrollStudent={onEnrollStudent}
          onAssignHomeroom={onAssignHomeroom}
          isHomeroomOf={isHomeroomOfTeacher}
          clickable
        />
      </div>
    );
  }

  const clickable = canManageClasses;

  return (
    <ClassSection
      classes={classes}
      selectedAyId={selectedAyId}
      currentUserId={currentUserId}
      canManageClasses={canManageClasses}
      onViewStudents={onViewStudents}
      onEnrollStudent={onEnrollStudent}
      onAssignHomeroom={onAssignHomeroom}
      isHomeroomOf={isHomeroomOfTeacher}
      clickable={clickable}
    />
  );
}

interface ClassSectionProps {
  title?: string;
  subtitle?: string;
  classes: Class[];
  selectedAyId: string;
  currentUserId?: string;
  canManageClasses: boolean;
  onViewStudents: (classId: string) => void;
  onEnrollStudent: (classId: string) => void;
  onAssignHomeroom: (classId: string) => void;
  isHomeroomOf: (cls: Class) => boolean;
  clickable: boolean;
}

function ClassSection({
  title,
  subtitle,
  classes,
  selectedAyId,
  currentUserId,
  canManageClasses,
  onViewStudents,
  onEnrollStudent,
  onAssignHomeroom,
  isHomeroomOf,
  clickable,
}: ClassSectionProps) {
  if (classes.length === 0) return null;

  return (
    <section className="space-y-3">
      {title && (
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Badge variant="role" className="text-xs">
            {classes.length}
          </Badge>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            selectedAyId={selectedAyId}
            canManageClasses={canManageClasses}
            isHomeroom={isHomeroomOf(cls) && !!currentUserId}
            clickable={clickable}
            onViewStudents={onViewStudents}
            onEnrollStudent={onEnrollStudent}
            onAssignHomeroom={onAssignHomeroom}
          />
        ))}
      </div>
    </section>
  );
}

interface ClassCardProps {
  cls: Class;
  selectedAyId: string;
  canManageClasses: boolean;
  isHomeroom: boolean;
  clickable: boolean;
  onViewStudents: (classId: string) => void;
  onEnrollStudent: (classId: string) => void;
  onAssignHomeroom: (classId: string) => void;
}

function ClassCard({
  cls,
  selectedAyId,
  canManageClasses,
  isHomeroom,
  clickable,
  onViewStudents,
  onEnrollStudent,
  onAssignHomeroom,
}: ClassCardProps) {
  const t = useTranslations("Classes");
  const homeroom = cls.homeroomAssignments?.[0]?.teacher?.name || t("unassigned");
  const enrolledCount =
    cls._count?.enrollments ?? cls.enrollments?.length ?? 0;

  return (
    <Card
      onClick={clickable ? () => onViewStudents(cls.id) : undefined}
      className={`hover:border-primary/50 transition-all ${
        clickable ? "cursor-pointer" : ""
      } ${
        isHomeroom
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40"
          : ""
      }`}
    >
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          {isHomeroom && (
            <Badge
              variant="role"
              className="mb-2 gap-1 bg-primary/15 text-primary border-primary/40"
            >
              <Crown className="w-3 h-3" />
              {t("yourHomeroom")}
            </Badge>
          )}
          <Badge variant="role" className="mb-2">
            {t("gradeLabel", { grade: cls.grade })}
          </Badge>
          <CardTitle className="text-xl">{cls.name}</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            {t("academicYearLabel", { name: cls.academicYear?.name || selectedAyId })}
          </CardDescription>
        </div>
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <SchoolIcon className="w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2 text-sm border-t border-border/40 mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <GraduationCap className="w-4 h-4 text-success" />
            {t("homeroomLabel", { name: homeroom })}
          </span>
          <span className="flex items-center gap-1 font-bold text-foreground">
            <Users className="w-4 h-4 text-primary" />
            {t("enrolledCount", { count: enrolledCount })}
          </span>
        </div>

        {canManageClasses && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEnrollStudent(cls.id);
              }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              {t("enrollStudentButton")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onAssignHomeroom(cls.id);
              }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t("assignHomeroomButton")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
