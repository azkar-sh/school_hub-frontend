import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ClassesHeaderProps {
  currentRole: string;
  canManageClasses: boolean;
  onCreateClass: () => void;
}

export function ClassesHeader({
  currentRole,
  canManageClasses,
  onCreateClass,
}: ClassesHeaderProps) {
  const t = useTranslations("Classes");
  const tCommon = useTranslations("Common");

  const subtitle =
    currentRole === "SCHOOL_ADMIN"
      ? t("subtitleAdmin")
      : currentRole === "TEACHER"
        ? t("subtitleTeacher")
        : t("subtitleStudent");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {tCommon("info.classesEnrollmentHub")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {canManageClasses && (
          <Button variant="role" className="shadow-md" onClick={onCreateClass}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("createClass")}
          </Button>
        )}
      </div>
    </div>
  );
}
