import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, X } from "lucide-react";
import { SubTopic } from "@/types";
import { NewQuestionOption } from "../hooks";
import { useTranslations } from "next-intl";

interface QuestionCreatorCardProps {
  isDemoMode: boolean;
  subTopics: SubTopic[];
  selectedSubTopicId: string;
  onSelectSubTopic: (id: string) => void;
  qText: string;
  onChangeQText: (value: string) => void;
  qType: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  onChangeQType: (value: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER") => void;
  qPoints: number;
  onChangeQPoints: (value: number) => void;
  options: NewQuestionOption[];
  onChangeOptions: (options: NewQuestionOption[]) => void;
  onAddQuestion: () => void;
  /** When set, the form acts as an editor for an existing question. */
  editMode?: boolean;
  onSaveQuestion?: () => void;
  onCancelEdit?: () => void;
  isSaving?: boolean;
}

export function QuestionCreatorCard({
  isDemoMode,
  subTopics,
  selectedSubTopicId,
  onSelectSubTopic,
  qText,
  onChangeQText,
  qType,
  onChangeQType,
  qPoints,
  onChangeQPoints,
  options,
  onChangeOptions,
  onAddQuestion,
  editMode,
  onSaveQuestion,
  onCancelEdit,
  isSaving,
}: QuestionCreatorCardProps) {
  const t = useTranslations("Assessments");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {editMode ? <Save className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
          <span>{editMode ? t("editQuestionTitle") : t("addQuestionTitle")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isDemoMode && subTopics.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {t("subTopicTarget")}
            </label>
            <select
              value={selectedSubTopicId}
              onChange={(e) => onSelectSubTopic(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
            >
              {subTopics.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("questionPrompt")}
          </label>
          <Input
            placeholder={t("questionPromptPlaceholder")}
            value={qText}
            onChange={(e) => onChangeQText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {t("questionType")}
            </label>
            <select
              value={qType}
              onChange={(event) => {
                const value = event.target.value;
                if (
                  value === "MCQ" ||
                  value === "TRUE_FALSE" ||
                  value === "SHORT_ANSWER"
                ) {
                  onChangeQType(value);
                }
              }}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
            >
              <option value="MCQ">{t("optionMCQ")}</option>
              <option value="TRUE_FALSE">{t("optionTrueFalse")}</option>
              <option value="SHORT_ANSWER">{t("optionShortAnswer")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {t("pointsWeight")}
            </label>
            <Input
              type="number"
              value={qPoints}
              onChange={(e) => onChangeQPoints(Number(e.target.value))}
            />
          </div>
        </div>

        {/* MCQ Options Config */}
        {qType === "MCQ" && (
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("mcqOptionsLabel")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={opt.isCorrect}
                    onChange={() =>
                      onChangeOptions(
                        options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx,
                        })),
                      )
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      onChangeOptions(
                        options.map((o, i) =>
                          i === idx ? { ...o, text: e.target.value } : o,
                        ),
                      )
                    }
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* True/False Correct Answer Config */}
        {qType === "TRUE_FALSE" && (
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("correctAnswer")}
            </label>
            <div className="flex items-center gap-6">
              {options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="tfCorrect"
                    checked={opt.isCorrect}
                    onChange={() =>
                      onChangeOptions(
                        options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx,
                        })),
                      )
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm font-medium">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {editMode ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onCancelEdit}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={onSaveQuestion}
              variant="role"
              className="flex-1"
              isLoading={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("saveChanges")}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onAddQuestion}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("addQuestion")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
