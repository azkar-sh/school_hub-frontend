import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ClassesHeaderProps {
  canManageClasses: boolean;
  onCreateClass: () => void;
}

export function ClassesHeader({
  canManageClasses,
  onCreateClass,
}: ClassesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Classes & Enrollment Hub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {canManageClasses
            ? "Manage school class sections, student enrollments, and homeroom assignments"
            : "View your class section details and homeroom teacher"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {canManageClasses && (
          <Button variant="role" className="shadow-md" onClick={onCreateClass}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        )}
      </div>
    </div>
  );
}
