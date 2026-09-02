import { getMockSubjects } from "@/lib/mock-data";
import { GuideResourcePage } from "@/components/ui/guide-resource-page";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subject =
    getMockSubjects("TEACHER").find((item) => item.id === id) ??
    getMockSubjects("TEACHER")[0];
  return (
    <GuideResourcePage
      title={`${subject.name} (${subject.code})`}
      description="Explore topics and their sub-topics."
      rows={subject.topics.map((topic, index) => ({
        label: topic.name,
        value: `${topic.subTopics.length} sub-topics`,
        detail: "Topic curriculum",
        href: `/subjects/${subject.id}/topics/topic-${index + 1}`,
      }))}
      action={{ label: "Add Topic" }}
    />
  );
}
