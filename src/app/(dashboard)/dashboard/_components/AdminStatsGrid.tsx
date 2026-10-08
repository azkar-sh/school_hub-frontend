import {
  UserRound,
  GraduationCap,
  School as SchoolIcon,
  BookOpen,
} from "lucide-react";
import { MockSchoolAdminOverview } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/StatCard";

interface AdminStatsGridProps {
  overview: MockSchoolAdminOverview;
  isLoading?: boolean;
}

export function AdminStatsGrid({ overview, isLoading }: AdminStatsGridProps) {
  const t = useTranslations("Dashboard.adminStats");

  return (
    <>
      <StatCard
        title={t("teachers")}
        value={overview.teachersCount}
        icon={UserRound}
        subtitle={t("activeTeachingStaff")}
        href="/members?role=TEACHER"
        isLoading={isLoading}
      />

      <StatCard
        title={t("students")}
        value={overview.studentsCount}
        icon={GraduationCap}
        subtitle={t("enrolledStudents")}
        href="/members?role=STUDENT"
        isLoading={isLoading}
      />

      <StatCard
        title={t("classes")}
        value={overview.classesCount}
        icon={SchoolIcon}
        subtitle={t("activeClassSections")}
        href="/classes"
        isLoading={isLoading}
      />

      <StatCard
        title={t("subjects")}
        value={overview.subjectsCount}
        icon={BookOpen}
        subtitle={t("registeredSubjects")}
        href="/subjects"
        isLoading={isLoading}
      />
    </>
  );
}
