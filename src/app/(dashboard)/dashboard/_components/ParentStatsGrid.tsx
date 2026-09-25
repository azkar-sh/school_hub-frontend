import {
  Users,
  Award,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { MockParentChild } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/StatCard";

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

  const childSummary = `${parentChildren[0]?.name ?? t("noChildren")}${
    studentClassGrade ? t("gradeSuffix", { grade: studentClassGrade }) : ""
  }`;

  return (
    <>
      <StatCard
        title={t("childrenLinked")}
        value={parentChildren.length}
        icon={Users}
        subtitle={childSummary}
        href="/children"
        isLoading={isLoading}
      />

      <StatCard
        title={t("childGpaAvg")}
        value={avgScore === null ? t("noData") : `${avgScore}%`}
        icon={Award}
        subtitle={t("acrossGradedAssessments")}
        href="/results"
        valueColor="primary"
        isLoading={isLoading}
      />

      <StatCard
        title={t("completedTests")}
        value={completedCount}
        icon={CheckCircle2}
        subtitle={t("submittedAssessments")}
        href="/results"
        valueColor="success"
        isLoading={isLoading}
      />

      <StatCard
        title={t("attendance")}
        value={t("attendanceValue")}
        icon={GraduationCap}
        subtitle={t("perfectAttendance")}
        href="/children"
        isLoading={isLoading}
      />
    </>
  );
}
