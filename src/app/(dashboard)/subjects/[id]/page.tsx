"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getMockSubjects } from "@/lib/mock-data";
import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function SubjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  const subject =
    getMockSubjects("TEACHER").find((item) => item.id === id) ??
    getMockSubjects("TEACHER")[0];
  return (
    <GuideResourcePage
      title={`${subject.name} (${subject.code})`}
      description={tCommon("exploreTopics")}
      rows={subject.topics.map((topic, index) => ({
        label: topic.name,
        value: t("subTopicsCount", { count: topic.subTopics.length }),
        detail: tCommon("topicCurriculum"),
        href: `/subjects/${subject.id}/topics/topic-${index + 1}`,
      }))}
      action={{ label: t("addTopic") }}
    />
  );
}
