"use client";

import { GuideResourcePage } from "@/components/ui/guide-resource-page";
import { useTranslations } from "next-intl";

export default function AcademicYearsPage() {
  const t = useTranslations("AcademicYears");

  return (
    <GuideResourcePage
      title={t("title")}
      description={t("description")}
      rows={[
        {
          label: "2026/2027",
          value: t("active"),
          detail: "Jul 1, 2026 to Jun 30, 2027",
          href: "/classes",
        },
      ]}
      action={{ label: t("createAcademicYear") }}
    />
  );
}
