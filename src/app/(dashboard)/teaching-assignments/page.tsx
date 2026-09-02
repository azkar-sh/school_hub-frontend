import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function TeachingAssignmentsPage() {
  return (
    <GuideResourcePage
      title="Teaching Assignments"
      description="See which teacher delivers each subject to each class in 2026/2027."
      rows={[
        {
          label: "Bu Siti",
          value: "Mathematics / 8A",
          detail: "SMA Garuda Hope · Active",
        },
        {
          label: "Bu Siti",
          value: "Mathematics / 8B",
          detail: "SMA Garuda Hope · Active",
        },
        {
          label: "Pak Hendra",
          value: "Science / 8A",
          detail: "SMA Garuda Hope · Active",
        },
        {
          label: "Pak Hendra",
          value: "Science / 8B",
          detail: "SMA Garuda Hope · Active",
        },
      ]}
      action={{ label: "Assign Teacher" }}
    />
  );
}
