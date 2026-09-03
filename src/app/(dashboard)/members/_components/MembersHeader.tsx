import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { School } from "@/types";

interface MembersHeaderProps {
  isDemoMode: boolean;
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  onAddMember: () => void;
}

export function MembersHeader({
  isDemoMode,
  schools,
  selectedSchoolId,
  onSelectSchool,
  onAddMember,
}: MembersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          School Members
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage teachers, students, and parents in your school
        </p>
      </div>
      <div className="flex items-center gap-3">
        {!isDemoMode && schools.length > 0 && (
          <select
            className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold"
            value={selectedSchoolId}
            onChange={(e) => onSelectSchool(e.target.value)}
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
        <Button variant="role" className="shadow-md" onClick={onAddMember}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  );
}
