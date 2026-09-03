import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserRole } from "@/types";
import { ROLE_FILTERS } from "../hooks";

interface MembersFilterBarProps {
  search: string;
  onChangeSearch: (value: string) => void;
  roleFilter: "ALL" | UserRole;
  onChangeRoleFilter: (value: "ALL" | UserRole) => void;
}

export function MembersFilterBar({
  search,
  onChangeSearch,
  roleFilter,
  onChangeRoleFilter,
}: MembersFilterBarProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {ROLE_FILTERS.map((rf) => (
            <Button
              key={rf.value}
              variant={roleFilter === rf.value ? "role" : "outline"}
              size="sm"
              onClick={() => onChangeRoleFilter(rf.value)}
              className="text-xs"
            >
              {rf.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
