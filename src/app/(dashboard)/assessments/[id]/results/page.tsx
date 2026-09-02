import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function AssessmentResultsPage() {
  return (
    <GuideResourcePage
      title="Assessment Results"
      description="Review submission status and scores for this assessment."
      rows={[
        {
          label: "Budi Santoso",
          value: "3 / 3",
          detail: "GRADED · Submitted",
          href: "/results",
        },
        {
          label: "Siti Rahma",
          value: "Pending",
          detail: "SUBMITTED · Awaiting grading",
          href: "/submissions",
        },
      ]}
    />
  );
}
