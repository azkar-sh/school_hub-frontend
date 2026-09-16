import { Button } from "@/components/ui/button";

interface AssessmentsPaginationProps {
  meta: { page: number; totalPages: number };
  onPageChange: (updater: (p: number) => number) => void;
  isDemoMode: boolean;
}

export function AssessmentsPagination({
  meta,
  onPageChange,
  isDemoMode,
}: AssessmentsPaginationProps) {
  if (isDemoMode || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={meta.page <= 1}
        onClick={() => onPageChange((p) => Math.max(1, p - 1))}
      >
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange((p) => Math.min(meta.totalPages, p + 1))}
      >
        Next
      </Button>
    </div>
  );
}
