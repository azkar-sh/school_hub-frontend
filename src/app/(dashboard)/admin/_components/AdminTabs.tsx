import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, UserPlus } from "lucide-react";
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
  return (
    <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-2">
      <Button
        variant={activeTab === "schools" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("schools")}
        className="gap-2 text-xs"
      >
        <Building2 className="w-4 h-4" />
        Schools ({schoolsCount})
      </Button>
      <Button
        variant={activeTab === "academicYears" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("academicYears")}
        className="gap-2 text-xs"
      >
        <Calendar className="w-4 h-4" />
        Academic Years ({academicYearsCount})
      </Button>
      <Button
        variant={activeTab === "members" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("members")}
        className="gap-2 text-xs"
      >
        <Users className="w-4 h-4" />
        School Members
      </Button>
      <Button
        variant={activeTab === "parents" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("parents")}
        className="gap-2 text-xs"
      >
        <UserPlus className="w-4 h-4" />
        Link Parent-Student
      </Button>
    </div>
  );
}
