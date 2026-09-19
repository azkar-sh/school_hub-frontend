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
  Crown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { MockClass } from "@/lib/mock-data";

interface MockClassesGridProps {
  classes: MockClass[];
  currentRole?: string;
}

export function MockClassesGrid({
  classes,
  currentRole,
}: MockClassesGridProps) {
  const t = useTranslations("Classes");

  if (currentRole === "TEACHER") {
    const myClasses = classes.filter((c) => c.isMyClass);
    const otherClasses = classes.filter((c) => !c.isMyClass);

    return (
      <div className="space-y-8">
        <MockSection
          title={t("myClasses")}
          subtitle={t("classesYouTeachDesc")}
          classes={myClasses}
          currentRole={currentRole}
        />
        <MockSection
          title={t("otherClasses")}
          subtitle={t("otherClassesDesc")}
          classes={otherClasses}
          currentRole={currentRole}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {classes.map((cls) => (
        <MockCard key={cls.id} cls={cls} currentRole={currentRole} />
      ))}
    </div>
  );
}

function MockSection({
  title,
  subtitle,
  classes,
  currentRole,
}: {
  title: string;
  subtitle: string;
  classes: MockClass[];
  currentRole?: string;
}) {
  if (classes.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="role" className="text-xs">
          {classes.length}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <MockCard key={cls.id} cls={cls} currentRole={currentRole} />
        ))}
      </div>
    </section>
  );
}

function MockCard({
  cls,
  currentRole,
}: {
  cls: MockClass;
  currentRole?: string;
}) {
  const t = useTranslations("Classes");
  const tCommon = useTranslations("Common");
  const isHomeroom = cls.isHomeroom;
  return (
    <Card
      className={`hover:border-primary/50 transition-all ${
        cls.isCurrentStudentClass ? "border-primary/40 bg-primary/5" : ""
      } ${
        isHomeroom
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40"
          : ""
      }`}
    >
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isHomeroom && (
              <Badge
                variant="role"
                className="gap-1 bg-primary/15 text-primary border-primary/40"
              >
                <Crown className="w-3 h-3" />
                {t("yourHomeroom")}
              </Badge>
            )}
            {cls.isCurrentStudentClass && (
              <Badge variant="role" className="gap-1">
                <BookmarkCheck className="w-3 h-3" />
                {currentRole === "PARENT" ? tCommon("info.childsClass") : tCommon("info.yourClass")}
              </Badge>
            )}
            <Badge variant="role">{t("gradeLabel", { grade: cls.grade })}</Badge>
          </div>
          <CardTitle className="text-xl">{cls.name}</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            {t("academicYearLabel", { name: cls.academicYear })}
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
            {t("homeroomLabel", { name: cls.homeroomTeacher })}
          </span>
          <span className="flex items-center gap-1 font-bold text-foreground">
            <Users className="w-4 h-4 text-primary" />
            {t("studentsCount", { count: cls.studentsCount })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
