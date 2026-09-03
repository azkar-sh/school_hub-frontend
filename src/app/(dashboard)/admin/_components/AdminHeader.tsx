import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="role" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            School Administration
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          School & Academic Operations
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage institution profiles, academic terms, staff & student
          memberships
        </p>
      </div>
    </div>
  );
}
