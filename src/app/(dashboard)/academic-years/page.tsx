import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function AcademicYearsPage() {
  return (
    <GuideResourcePage
      title="Academic Years"
      description="Manage school terms and the classes attached to each year."
      rows={[
        {
          label: "2026/2027",
          value: "Active",
          detail: "Jul 1, 2026 to Jun 30, 2027",
          href: "/classes",
        },
      ]}
      action={{ label: "Create Academic Year" }}
    />
  );
}
