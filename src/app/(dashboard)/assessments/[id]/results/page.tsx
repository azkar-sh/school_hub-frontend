"use client";

import { GuideResourcePage } from "@/components/ui/guide-resource-page";
import { useTranslations } from "next-intl";

export default function AssessmentResultsPage() {
  const t = useTranslations("Assessments");
  return (
    <GuideResourcePage
      title={t("resultsTitle")}
      description={t("resultsDescription")}
      rows={[
        {
          label: "Budi Santoso",
          value: "3 / 3",
          detail: "GRADED · Submitted",
          href: "/results",
        },
        {
          label: "Siti Rahma",
          value: t("pending"),
          detail: "SUBMITTED · Awaiting grading",
          href: "/submissions",
        },
      ]}
    />
  );
}
