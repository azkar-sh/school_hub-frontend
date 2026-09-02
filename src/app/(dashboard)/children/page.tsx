import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function ChildrenPage() {
  return (
    <GuideResourcePage
      title="Children"
      description="Monitor linked students and open their assessment history."
      rows={[
        {
          label: "Budi Santoso",
          value: "8A",
          detail: "1 graded result · 2 assessments",
          href: "/children/student1-garuda",
        },
      ]}
    />
  );
}
