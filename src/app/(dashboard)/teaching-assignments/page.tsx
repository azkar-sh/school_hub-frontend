import { GuideResourcePage } from "@/components/ui/guide-resource-page";
import { useTranslations } from "next-intl";

export default function TeachingAssignmentsPage() {
  const t = useTranslations("TeachingAssignments");

  return (
    <GuideResourcePage
      title={t("title")}
      description={t("description")}
      rows={[
        {
          label: "Bu Siti",
          value: "Mathematics / 8A",
          detail: t("institutionDetail"),
        },
        {
          label: "Bu Siti",
          value: "Mathematics / 8B",
          detail: t("institutionDetail"),
        },
        {
          label: "Pak Hendra",
          value: "Science / 8A",
          detail: t("institutionDetail"),
        },
        {
          label: "Pak Hendra",
          value: "Science / 8B",
          detail: t("institutionDetail"),
        },
      ]}
      action={{ label: t("assignTeacher") }}
    />
  );
}
