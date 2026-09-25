import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList } from "lucide-react";
import { School } from "@/types";
import { useTranslations } from "next-intl";

interface TeachingAssignmentsHeaderProps {
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  onAssignTeacher: () => void;
}

export function TeachingAssignmentsHeader({
  schools,
  selectedSchoolId,
  onSelectSchool,
  onAssignTeacher,
}: TeachingAssignmentsHeaderProps) {
  const t = useTranslations("TeachingAssignments");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {t("description")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {schools.length > 1 && (
          <select
            className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
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
        <Button
          variant="role"
          onClick={onAssignTeacher}
          className="gap-2 rounded-xl shadow-md font-semibold shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t("assignTeacher")}</span>
        </Button>
      </div>
    </div>
  );
}
