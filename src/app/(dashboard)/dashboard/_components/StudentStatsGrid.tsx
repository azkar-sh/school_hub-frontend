import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileCheck2,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface StudentStatsGridProps {
  isDemoMode: boolean;
  quizzesTaken: number;
  averageScore: number | null;
  pendingDue: number;
  isLoading?: boolean;
}

export function StudentStatsGrid({
  isDemoMode,
  quizzesTaken,
  averageScore,
  pendingDue,
  isLoading,
}: StudentStatsGridProps) {
  const t = useTranslations("Dashboard.studentStats");
  const taken = isDemoMode ? 12 : quizzesTaken;
  const avg = isDemoMode ? 92.5 : averageScore;
  const pending = isDemoMode ? 2 : pendingDue;

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
            {t("quizzesTaken")}
          </CardTitle>
          <FileCheck2 className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {num(taken)}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span>
              {isDemoMode ? t("plusThisWeek") : t("submittedAssessments")}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("averageScore")}
          </CardTitle>
          <Award className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : avg === null ? (
              t("noData")
            ) : (
              `${avg}%`
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isDemoMode
              ? t("honorRoll")
              : t("acrossGradedAssessments")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("pendingDue")}
          </CardTitle>
          <Clock className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-warning">
            {num(pending)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isDemoMode ? t("mathScienceExams") : t("awaitingSubmission")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {t("studyStreak")}
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-success">{t("daysValue")}</div>
          <p className="text-xs text-muted-foreground mt-1">{t("keepItUp")}</p>
        </CardContent>
      </Card>
    </>
  );
}
