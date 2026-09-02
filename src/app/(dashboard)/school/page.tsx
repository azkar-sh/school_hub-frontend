import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function SchoolPage() {
  return (
    <GuideResourcePage
      title="School Information"
      description="Review the active school profile used by this workspace."
      rows={[
        {
          label: "SMA Garuda Hope",
          value: "School",
          detail: "Seeded demo school",
        },
        {
          label: "School ID",
          value: "garuda-hope",
          detail: "Members, classes, and subjects belong to this school",
        },
        {
          label: "Created",
          value: "2026",
          detail: "Academic data starts in 2026/2027",
        },
      ]}
      action={{ label: "Edit School" }}
    />
  );
}
