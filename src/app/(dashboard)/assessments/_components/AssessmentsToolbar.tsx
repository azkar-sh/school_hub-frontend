import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AssessmentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  isDemoMode: boolean;
  meta: PaginationMeta;
}

export function AssessmentsToolbar({
  search,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  isDemoMode,
  meta,
}: AssessmentsToolbarProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <Input
            placeholder={
              isDemoMode
                ? "Search by title or subject…"
                : "Search by title (server)…"
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "QUIZ", "EXAM", "ASSIGNMENT"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "role" : "outline"}
              size="sm"
              onClick={() => onFilterTypeChange(type)}
              className="capitalize text-xs"
            >
              {type.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Pagination summary — driven by backend meta */}
      {!isDemoMode && meta.total > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </span>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
        </div>
      )}
    </Card>
  );
}
