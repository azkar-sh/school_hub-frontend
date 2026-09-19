import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function AssessmentsLoading() {
  const t = useTranslations("Assessments");
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{t("loadingAssessments")}</span>
    </div>
  );
}