import { useTranslations } from "next-intl";

export function AssessmentsError() {
  const t = useTranslations("Assessments");
  return (
    <div className="py-10 text-center text-xs text-destructive">
      {t("errorFailedLoad")}
    </div>
  );
}