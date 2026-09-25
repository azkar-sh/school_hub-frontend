import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTab } from "../hooks";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenCreateSchool: () => void;
  onOpenLinkGuardian: () => void;
}

export function AdminHeader({
  activeTab,
  onOpenCreateSchool,
  onOpenLinkGuardian,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="role" className="gap-1.5 px-2.5 py-0.5 font-semibold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Executive Administration
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
          School Administration Hub
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Institutional governance, multi-campus network, and parent-student guardianship relations.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {activeTab === "institution" && (
          <Button
            variant="role"
            onClick={onOpenCreateSchool}
            className="gap-2 rounded-xl shadow-md font-semibold text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Branch</span>
          </Button>
        )}
        {activeTab === "guardianship" && (
          <Button
            variant="role"
            onClick={onOpenLinkGuardian}
            className="gap-2 rounded-xl shadow-md font-semibold text-xs sm:text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Link Guardian</span>
          </Button>
        )}
      </div>
    </div>
  );
}
