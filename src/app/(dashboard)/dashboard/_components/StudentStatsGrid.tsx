import {
  FileCheck2,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/StatCard";

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

  return (
    <>
      <StatCard
        title={t("quizzesTaken")}
        value={taken}
        icon={FileCheck2}
        subtitle={isDemoMode ? t("plusThisWeek") : t("submittedAssessments")}
        subtitleIcon={<TrendingUp className="w-3.5 h-3.5 text-success shrink-0" />}
        badge={isDemoMode ? { text: "+2 this week", variant: "success" } : undefined}
        href="/assessments"
        isLoading={isLoading}
      />

      <StatCard
        title={t("averageScore")}
        value={avg === null ? t("noData") : `${avg}%`}
        icon={Award}
        subtitle={isDemoMode ? t("honorRoll") : t("acrossGradedAssessments")}
        badge={avg && avg >= 90 ? { text: "Top Tier", variant: "primary" } : undefined}
        href="/results"
        valueColor="primary"
        isLoading={isLoading}
      />

      <StatCard
        title={t("pendingDue")}
        value={pending}
        icon={Clock}
        subtitle={isDemoMode ? t("mathScienceExams") : t("awaitingSubmission")}
        badge={
          pending > 0
            ? { text: "Action Needed", variant: "warning" }
            : { text: "Up to Date", variant: "success" }
        }
        href={pending > 0 ? "/assessments?status=PENDING" : "/assessments"}
        variant={pending > 0 ? "warning" : "default"}
        isLoading={isLoading}
      />

      <StatCard
        title={t("studyStreak")}
        value={t("daysValue")}
        icon={CheckCircle2}
        subtitle={t("keepItUp")}
        badge={{ text: "On Fire 🔥", variant: "success" }}
        href="/results"
        valueColor="success"
        isLoading={isLoading}
      />
    </>
  );
}
