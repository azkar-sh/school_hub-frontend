import { getMockSubjects } from "@/lib/mock-data";
import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  const subject =
    getMockSubjects("TEACHER").find((item) => item.id === id) ??
    getMockSubjects("TEACHER")[0];
  const topicIndex = Math.max(0, Number(topicId.replace("topic-", "")) - 1);
  const topic = subject.topics[topicIndex] ?? subject.topics[0];
  return (
    <GuideResourcePage
      title={topic.name}
      description={`Sub-topics in ${subject.name}. Add questions to these curriculum units from an assessment.`}
      rows={topic.subTopics.map((name) => ({
        label: name,
        value: "Sub-topic",
        detail: `${subject.name} · ${topic.name}`,
      }))}
      action={{ label: "Add SubTopic" }}
    />
  );
}
