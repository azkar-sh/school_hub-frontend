import { FormProvider, UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TeachingAssignment, Topic } from "@/types";
import { AssessmentFormData } from "../hooks";
import { useTranslations } from "next-intl";

interface AssessmentDetailsStepProps {
  methods: UseFormReturn<AssessmentFormData>;
  isDemoMode: boolean;
  assignments: TeachingAssignment[];
  selectedAssignmentId: string;
  onSelectAssignment: (id: string) => void;
  onSubmit: (data: AssessmentFormData) => void;
  topics?: Topic[];
  selectedTopicId?: string | null;
  onSelectTopic?: (id: string | null) => void;
}

export function AssessmentDetailsStep({
  methods,
  isDemoMode,
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
  onSubmit,
  topics = [],
  selectedTopicId,
  onSelectTopic,
}: AssessmentDetailsStepProps) {
  const t = useTranslations("Assessments");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("assessmentDetailsTitle")}</CardTitle>
        <CardDescription>
          {t("assessmentDetailsDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            {!isDemoMode && assignments.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {t("targetAssignment")}
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => onSelectAssignment(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium"
                  required
                >
                  <option value="">
                    {t("selectAssignmentPlaceholder")}
                  </option>
                  {assignments.map((ta) => (
                    <option key={ta.id} value={ta.id}>
                      {ta.subject?.name || t("subject")} -{" "}
                      {ta.class?.name || t("class")} ({ta.academicYear?.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isDemoMode && selectedAssignmentId && onSelectTopic && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {t("topicOptional")}
                </label>
                <select
                  value={selectedTopicId || ""}
                  onChange={(e) => onSelectTopic(e.target.value || null)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium"
                >
                  <option value="">{t("allTopics")}</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <FormInput
              name="title"
              label={t("assessmentTitleLabel")}
              placeholder={t("assessmentTitlePlaceholder")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                name="type"
                label={t("assessmentTypeLabel")}
                options={[
                  { label: t("optionQuiz"), value: "QUIZ" },
                  { label: t("optionExam"), value: "EXAM" },
                  { label: t("optionAssignment"), value: "ASSIGNMENT" },
                ]}
              />

              <FormInput name="dueAt" label={t("dueDateLabel")} type="date" />
            </div>

            <FormTextarea
              name="description"
              label={t("descriptionLabel")}
              placeholder={t("descriptionPlaceholder")}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="role">
                {t("nextAddQuestions")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
