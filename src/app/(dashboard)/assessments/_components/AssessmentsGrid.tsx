import { MockAssessment } from "@/lib/mock-data";
import { AssessmentCard } from "./AssessmentCard";
import { useTranslations } from "next-intl";

interface AssessmentsGridProps {
  currentRole: string;
  items: MockAssessment[];
  actionLabel: (item: MockAssessment) => string;
}

export function AssessmentsGrid({
  currentRole,
  items,
  actionLabel,
}: AssessmentsGridProps) {
  const t = useTranslations("Assessments");

  if (items.length === 0) {
    return (
      <div className="col-span-2 py-14 text-center text-muted-foreground text-sm">
        {t("noAssessmentsMatch")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item) => (
        <AssessmentCard
          key={item.id}
          currentRole={currentRole}
          item={item}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
}
