import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { MockParentChild } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

interface ParentStatsGridProps {
  parentChildren: MockParentChild[];
  studentClassGrade: number;
  avgScore: number | null;
  completedCount: number;
  isLoading?: boolean;
}

export function ParentStatsGrid({
  parentChildren,
  studentClassGrade,
  avgScore,
  completedCount,
  isLoading,
}: ParentStatsGridProps) {
  const t = useTranslations("Dashboard.parentStats");
  const num = (v: number) =>
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
            {t("childrenLinked")}
          </CardTitle>
          <Users className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {num(parentChildren.length)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {parentChildren[0]?.name ?? t("noChildren")}
            {studentClassGrade ? t("gradeSuffix", { grade: studentClassGrade }) : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("childGpaAvg")}
          </CardTitle>
          <Award className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : avgScore === null ? (
              t("noData")
            ) : (
              `${avgScore}%`
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("acrossGradedAssessments")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("completedTests")}
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-success">
            {num(completedCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("submittedAssessments")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("attendance")}
          </CardTitle>
          <GraduationCap className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">{t("attendanceValue")}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("perfectAttendance")}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
