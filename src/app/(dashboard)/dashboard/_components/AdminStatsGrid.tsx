import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserRound,
  GraduationCap,
  School as SchoolIcon,
  BookOpen,
  Loader2,
} from "lucide-react";
import { MockSchoolAdminOverview } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

interface AdminStatsGridProps {
  overview: MockSchoolAdminOverview;
  isLoading?: boolean;
}

export function AdminStatsGrid({ overview, isLoading }: AdminStatsGridProps) {
  const t = useTranslations("Dashboard.adminStats");
  const value = (v: number) =>
    isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      v
    );

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("teachers")}
          </CardTitle>
          <UserRound className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.teachersCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("activeTeachingStaff")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("students")}
          </CardTitle>
          <GraduationCap className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.studentsCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("enrolledStudents")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("classes")}
          </CardTitle>
          <SchoolIcon className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.classesCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("activeClassSections")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("subjects")}
          </CardTitle>
          <BookOpen className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.subjectsCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("registeredSubjects")}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
