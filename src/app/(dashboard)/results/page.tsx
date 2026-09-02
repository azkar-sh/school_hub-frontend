import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function ResultsPage() {
  return (
    <GuideResourcePage
      title="Results"
      description="Scores and submission outcomes for the current role."
      rows={[
        {
          label: "Mathematics Quiz 1 - 8A",
          value: "3 / 3",
          detail: "Budi Santoso · Graded",
          href: "/assessments/quiz-math-8a",
        },
        {
          label: "Mathematics Quiz 1 - 8B",
          value: "Pending",
          detail: "Siti Rahma · Submitted",
          href: "/assessments/quiz-math-8b",
        },
        {
          label: "Science Homework 1 - 8A",
          value: "Draft",
          detail: "Budi Santoso · In progress",
          href: "/assessments/homework-science-8a",
        },
      ]}
    />
  );
}
