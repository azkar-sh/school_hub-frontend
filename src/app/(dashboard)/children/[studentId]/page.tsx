import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function ChildDetailPage() {
  return (
    <GuideResourcePage
      title="Budi Santoso"
      description="Assessment results for the student linked to this parent account."
      rows={[
        {
          label: "Mathematics Quiz 1 - 8A",
          value: "3 / 3",
          detail: "Graded · Mathematics",
          href: "/results",
        },
        {
          label: "Science Homework 1 - 8A",
          value: "Draft",
          detail: "Science · In progress",
          href: "/assessments/homework-science-8a",
        },
      ]}
    />
  );
}
