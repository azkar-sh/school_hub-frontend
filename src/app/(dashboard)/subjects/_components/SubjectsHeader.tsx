import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { School } from "@/types";
import { useTranslations } from "next-intl";

interface SubjectsHeaderProps {
  currentRole?: string;
  canEditCurriculum: boolean;
  canAddSubject: boolean;
  isDemoMode: boolean;
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  onAddSubject: () => void;
}

export function SubjectsHeader({
  canEditCurriculum,
  canAddSubject,
  isDemoMode,
  schools,
  selectedSchoolId,
  onSelectSchool,
  onAddSubject,
}: SubjectsHeaderProps) {
  const t = useTranslations("Common.info");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("subjectsTopicHierarchy")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {canEditCurriculum
            ? t("manageCurriculum")
            : t("exploreCurriculum")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* {!isDemoMode && schools.length > 0 && (
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
        )} */}

        {canAddSubject && (
          <Button variant="role" className="shadow-md" onClick={onAddSubject}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("addSubjectButton")}
          </Button>
        )}
      </div>
    </div>
  );
}
