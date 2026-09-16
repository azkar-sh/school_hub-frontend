import { MockAssessment } from "@/lib/mock-data";
import { AssessmentCard } from "./AssessmentCard";

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
  if (items.length === 0) {
    return (
      <div className="col-span-2 py-14 text-center text-muted-foreground text-sm">
        No assessments match your search.
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
