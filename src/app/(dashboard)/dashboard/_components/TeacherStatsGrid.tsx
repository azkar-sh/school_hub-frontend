import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School as SchoolIcon,
  FileCheck2,
  Clock,
  BarChart3,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

interface TeacherStatsGridProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  liveAssessmentsCount: number;
  pendingResults: number;
  classAverage: number | null;
  isLoading?: boolean;
}

export function TeacherStatsGrid({
  isDemoMode,
  teacherClasses,
  liveAssessmentsCount,
  pendingResults,
  classAverage,
  isLoading,
}: TeacherStatsGridProps) {
  const t = useTranslations("Dashboard.teacherStats");
  const num = (v: number, fallback = 0) =>
    isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      v ?? fallback
    );

  const myClassesCount = teacherClasses.length;
  const assessmentsCount = isDemoMode ? 8 : liveAssessmentsCount;
  const pendingCount = isDemoMode ? 14 : pendingResults;
  const avg = isDemoMode ? 86.4 : classAverage;

  return (
    <>
      <Link href="/classes" className="block group">
        <Card className="border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3.5 sm:p-6">
            <CardTitle className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground group-hover:text-primary transition-colors">
              {t("myClasses")}
            </CardTitle>
            <SchoolIcon className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-between">
              <span>{num(myClassesCount)}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              {t("teachingAssignments")}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/assessments" className="block group">
        <Card className="border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3.5 sm:p-6">
            <CardTitle className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground group-hover:text-primary transition-colors">
              {t("assessments")}
            </CardTitle>
            <FileCheck2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-between">
              <span>{num(assessmentsCount)}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              {t("quizzesExamsPublished")}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/submissions?status=SUBMITTED" className="block group">
        <Card className="border-warning/40 bg-warning/5 hover:border-warning/70 hover:bg-warning/10 transition-all cursor-pointer h-full ring-1 ring-warning/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3.5 sm:p-6">
            <CardTitle className="text-[11px] sm:text-xs font-semibold uppercase text-warning">
              {t("pendingResults")}
            </CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-warning flex items-center justify-between">
              <span>{num(pendingCount)}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-warning transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              {pendingCount === 0 ? "Semua tugas dinilai ✓" : t("submissionsWaitingReview")}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/results" className="block group">
        <Card className="border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3.5 sm:p-6">
            <CardTitle className="text-[11px] sm:text-xs font-semibold uppercase text-muted-foreground group-hover:text-primary transition-colors">
              {t("classAverage")}
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center justify-between">
              <span>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : avg === null ? (
                  t("noData")
                ) : (
                  `${avg}%`
                )}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              {t("acrossGradedSubmissions")}
            </p>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}

