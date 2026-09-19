"use client";

import { GuideResourcePage } from "@/components/ui/guide-resource-page";
import { useTranslations } from "next-intl";

export default function SchoolPage() {
  const t = useTranslations("School");

  return (
    <GuideResourcePage
      title={t("title")}
      description={t("description")}
      rows={[
        {
          label: "SMA Garuda Hope",
          value: t("schoolValue"),
          detail: t("seededDemoSchool"),
        },
        {
          label: t("schoolID"),
          value: "garuda-hope",
          detail: t("belongsToSchool"),
        },
        {
          label: t("createdLabel"),
          value: "2026",
          detail: t("academicDataStarts"),
        },
      ]}
      action={{ label: t("editSchool") }}
    />
  );
}
