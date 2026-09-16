import { Loader2 } from "lucide-react";

export function AssessmentsLoading() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Loading assessments…</span>
    </div>
  );
}