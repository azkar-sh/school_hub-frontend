import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function MembersPage() {
  return (
    <GuideResourcePage
      title="School Members"
      description="The seeded Garuda Hope community, grouped by account role."
      rows={[
        {
          label: "Bu Ratna",
          value: "SCHOOL_ADMIN",
          detail: "admin.garuda@learnhub.com",
        },
        {
          label: "Bu Siti",
          value: "TEACHER",
          detail: "teacher1.garuda@learnhub.com",
        },
        {
          label: "Pak Hendra",
          value: "TEACHER",
          detail: "teacher2.garuda@learnhub.com",
        },
        {
          label: "Budi Santoso",
          value: "STUDENT",
          detail: "student1.garuda@learnhub.com",
        },
        {
          label: "Siti Rahma",
          value: "STUDENT",
          detail: "student2.garuda@learnhub.com",
        },
        {
          label: "Dewi Lestari",
          value: "STUDENT",
          detail: "student3.garuda@learnhub.com",
        },
        {
          label: "Andi Wijaya",
          value: "STUDENT",
          detail: "student4.garuda@learnhub.com",
        },
        {
          label: "Pak Agus",
          value: "PARENT",
          detail: "parent1.garuda@learnhub.com",
        },
        {
          label: "Bu Yuni",
          value: "PARENT",
          detail: "parent2.garuda@learnhub.com",
        },
      ]}
      action={{ label: "Add Member" }}
    />
  );
}
