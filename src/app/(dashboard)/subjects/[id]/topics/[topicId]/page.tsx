"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getMockSubjects } from "@/lib/mock-data";
import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default function TopicDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const topicId = params?.topicId as string;
  const t = useTranslations("Subjects");
  const subject =
    getMockSubjects("TEACHER").find((item) => item.id === id) ??
    getMockSubjects("TEACHER")[0];
  const topicIndex = Math.max(0, Number(topicId.replace("topic-", "")) - 1);
  const topic = subject.topics[topicIndex] ?? subject.topics[0];
  return (
    <GuideResourcePage
      title={topic.name}
      description={t("subTopicsInSubjectDesc", { subjectName: subject.name })}
      rows={topic.subTopics.map((name) => ({
        label: name,
        value: t("subTopicShort"),
        detail: `${subject.name} · ${topic.name}`,
      }))}
      action={{ label: t("addSubtopic") }}
    />
  );
}
