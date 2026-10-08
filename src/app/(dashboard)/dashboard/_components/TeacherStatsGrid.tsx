import {
  School as SchoolIcon,
  FileCheck2,
  Clock,
  BarChart3,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/StatCard";

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

  const myClassesCount = teacherClasses.length;
  const assessmentsCount = isDemoMode ? 8 : liveAssessmentsCount;
  const pendingCount = isDemoMode ? 14 : pendingResults;
  const avg = isDemoMode ? 86.4 : classAverage;

  return (
    <>
      <StatCard
        title={t("myClasses")}
        value={myClassesCount}
        icon={SchoolIcon}
        subtitle={t("teachingAssignments")}
        href="/classes"
        isLoading={isLoading}
      />

      <StatCard
        title={t("assessments")}
        value={assessmentsCount}
        icon={FileCheck2}
        subtitle={t("quizzesExamsPublished")}
        href="/assessments"
        isLoading={isLoading}
      />

      <StatCard
        title={t("pendingResults")}
        value={pendingCount}
        icon={Clock}
        subtitle={
          pendingCount === 0
            ? "Semua tugas dinilai ✓"
            : t("submissionsWaitingReview")
        }
        badge={
          pendingCount > 0
            ? { text: "Needs Review", variant: "warning" }
            : { text: "All Graded", variant: "success" }
        }
        href="/submissions?status=SUBMITTED"
        variant={pendingCount > 0 ? "warning" : "default"}
        isLoading={isLoading}
      />

      <StatCard
        title={t("classAverage")}
        value={avg === null ? t("noData") : `${avg}%`}
        icon={BarChart3}
        subtitle={t("acrossGradedSubmissions")}
        href="/results"
        valueColor="primary"
        isLoading={isLoading}
      />
    </>
  );
}
