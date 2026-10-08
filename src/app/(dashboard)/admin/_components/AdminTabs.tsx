import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, HeartHandshake, LayoutDashboard } from "lucide-react";
import { AdminTab } from "../hooks";

interface AdminTabsProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  campusesCount: number;
  guardianshipsCount: number;
}

export function AdminTabs({
  activeTab,
  onChangeTab,
  campusesCount,
  guardianshipsCount,
}: AdminTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-2 scrollbar-none">
      <Button
        variant={activeTab === "institution" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("institution")}
        className="gap-2 text-xs sm:text-sm font-semibold rounded-xl"
      >
        <Building2 className="w-4 h-4" />
        <span>Institution & Campuses</span>
        <Badge
          variant="secondary"
          className="ml-1 text-[10px] px-1.5 py-0 h-5 font-bold"
        >
          {campusesCount}
        </Badge>
      </Button>

      <Button
        variant={activeTab === "guardianship" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("guardianship")}
        className="gap-2 text-xs sm:text-sm font-semibold rounded-xl"
      >
        <HeartHandshake className="w-4 h-4" />
        <span>Parent-Student Guardianship</span>
        <Badge
          variant="secondary"
          className="ml-1 text-[10px] px-1.5 py-0 h-5 font-bold"
        >
          {guardianshipsCount}
        </Badge>
      </Button>

      <Button
        variant={activeTab === "operations" ? "role" : "ghost"}
        size="sm"
        onClick={() => onChangeTab("operations")}
        className="gap-2 text-xs sm:text-sm font-semibold rounded-xl"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Operations Checklist</span>
      </Button>
    </div>
  );
}
