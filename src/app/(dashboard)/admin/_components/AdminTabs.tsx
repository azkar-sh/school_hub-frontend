import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminTab } from "../hooks";

interface AdminTabsProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  schoolsCount: number;
  academicYearsCount: number;
}

export function AdminTabs({
  activeTab,
  onChangeTab,
  schoolsCount,
  academicYearsCount,
}: AdminTabsProps) {
  const t = useTranslations("Common.info");
  return (
    <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-2">
      <Button
        variant={activeTab === "schools" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("schools")}
        className="gap-2 text-xs"
      >
        <Building2 className="w-4 h-4" />
        {t("schoolsCountTab", { count: schoolsCount })}
      </Button>
      <Button
        variant={activeTab === "academicYears" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("academicYears")}
        className="gap-2 text-xs"
      >
        <Calendar className="w-4 h-4" />
        {t("academicYearsCountTab", { count: academicYearsCount })}
      </Button>
      <Button
        variant={activeTab === "members" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("members")}
        className="gap-2 text-xs"
      >
        <Users className="w-4 h-4" />
        {t("schoolMembersTab")}
      </Button>
      <Button
        variant={activeTab === "parents" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("parents")}
        className="gap-2 text-xs"
      >
        <UserPlus className="w-4 h-4" />
        {t("linkParentStudentTab")}
      </Button>
    </div>
  );
}
