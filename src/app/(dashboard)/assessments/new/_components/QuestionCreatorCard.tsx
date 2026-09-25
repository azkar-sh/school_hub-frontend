import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Save,
  X,
  Check,
  CheckCircle2,
  XCircle,
  Trash2,
  HelpCircle,
  Sliders,
} from "lucide-react";
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

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];
const POINT_PRESETS = [5, 10, 20, 25];

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

  const handleSelectCorrect = (index: number) => {
    onChangeOptions(
      options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      })),
    );
  };

  const handleAddOption = () => {
    if (options.length >= 6) return;
    const letter = OPTION_LETTERS[options.length] || `Option ${options.length + 1}`;
    onChangeOptions([
      ...options,
      { text: `${t("optionPlaceholder", { letter }).replace(/\.+$/, "")}`, isCorrect: false },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== index);
    if (!next.some((o) => o.isCorrect)) {
      next[0].isCorrect = true;
    }
    onChangeOptions(next);
  };

  return (
    <Card className="border border-border/80 shadow-sm transition-all">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              {editMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <span>{editMode ? t("editQuestionTitle") : t("addQuestionTitle")}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {t("questionType")}
            </span>
            <Badge variant="outline" className="font-semibold text-xs">
              {qType === "MCQ"
                ? t("optionMCQ")
                : qType === "TRUE_FALSE"
                  ? t("optionTrueFalse")
                  : t("optionShortAnswer")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Sub-Topic Target */}
        {!isDemoMode && subTopics.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {t("subTopicTarget")}
            </label>
            <select
              value={selectedSubTopicId}
              onChange={(e) => onSelectSubTopic(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {subTopics.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Question Prompt */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("questionPrompt")}
            </label>
            <span className="text-[11px] text-muted-foreground">
              {t("supportDescInstructions")}
            </span>
          </div>
          <Input
            placeholder={t("questionPromptPlaceholder")}
            value={qText}
            onChange={(e) => onChangeQText(e.target.value)}
            className="text-sm font-medium h-11 rounded-xl"
          />
        </div>

        {/* Question Type & Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="MCQ">{t("optionMCQ")} (A-D / A-E)</option>
              <option value="TRUE_FALSE">{t("optionTrueFalse")}</option>
              <option value="SHORT_ANSWER">{t("optionShortAnswer")}</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("pointsWeight")}
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground mr-1">{t("preset")}</span>
                {POINT_PRESETS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => onChangeQPoints(pts)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      qPoints === pts
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/80 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="number"
              min={1}
              max={100}
              value={qPoints}
              onChange={(e) => onChangeQPoints(Number(e.target.value))}
              className="h-11 rounded-xl font-bold"
            />
          </div>
        </div>

        {/* MCQ Options Config */}
        {qType === "MCQ" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("optionsAnswersKey")}
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("clickToMarkKey")}
                </p>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                {options.length} {t("highSchoolStandardOptions")}
              </span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => {
                const letter = OPTION_LETTERS[idx] || String(idx + 1);
                const isSelected = opt.isCorrect;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-emerald-500/70 bg-emerald-500/5 ring-1 ring-emerald-500/30 dark:bg-emerald-950/20"
                        : "border-border/70 bg-card hover:border-border"
                    }`}
                  >
                    {/* Clickable Letter badge to mark as correct */}
                    <button
                      type="button"
                      onClick={() => handleSelectCorrect(idx)}
                      title={t("clickToSetKey")}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-transform active:scale-95 ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {letter}
                    </button>

                    {/* Option Text Input */}
                    <Input
                      value={opt.text}
                      onChange={(e) =>
                        onChangeOptions(
                          options.map((o, i) =>
                            i === idx ? { ...o, text: e.target.value } : o,
                          ),
                        )
                      }
                      placeholder={t("optionPlaceholder", { letter })}
                      className={`text-sm rounded-lg flex-1 h-9 ${
                        isSelected ? "border-emerald-500/40 font-medium" : ""
                      }`}
                    />

                    {/* Correct Badge or Mark Button */}
                    {isSelected ? (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t("answerKey")}</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectCorrect(idx)}
                        className="text-xs text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 shrink-0 h-8 px-2"
                      >
                        {t("selectKey")}
                      </Button>
                    )}

                    {/* Delete Option if > 2 */}
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(idx)}
                        title={t("removeOptionTooltip")}
                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Option Button (up to 5 options for SMA/SMK standard) */}
            <div className="flex items-center justify-between pt-1">
              {options.length < 5 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="rounded-lg text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  {t("addOption")} ({OPTION_LETTERS[options.length]})
                </Button>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  {t("max5OptionsNotice")}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">
                {t("activeKey")}{" "}
                <strong className="text-emerald-600">
                  {OPTION_LETTERS[options.findIndex((o) => o.isCorrect)] || "A"}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* True/False Config */}
        {qType === "TRUE_FALSE" && (
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("correctAnswer")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => {
                const isSelected = opt.isCorrect;
                const isTrue = opt.text.toLowerCase().includes("true") || opt.text.toLowerCase().includes("benar");

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCorrect(idx)}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border font-semibold text-sm transition-all ${
                      isSelected
                        ? isTrue
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                          : "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-xs"
                        : "border-border/80 bg-card text-muted-foreground hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    {isTrue ? (
                      <CheckCircle2 className={`w-4 h-4 ${isSelected ? "text-emerald-600" : ""}`} />
                    ) : (
                      <XCircle className={`w-4 h-4 ${isSelected ? "text-rose-600" : ""}`} />
                    )}
                    <span>{opt.text}</span>
                    {isSelected && (
                      <Badge variant="outline" className="text-[10px] ml-1 bg-background/80">
                        {t("key")}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Short Answer Info */}
        {qType === "SHORT_ANSWER" && (
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">{t("shortAnswerStudent")}</span>
              <p className="mt-0.5">
                {t("shortAnswerNotice")}
              </p>
            </div>
          </div>
        )}

        {/* Form Action Buttons */}
        {editMode ? (
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={onCancelEdit}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={onSaveQuestion}
              variant="role"
              className="flex-1 rounded-xl shadow-xs"
              isLoading={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("saveChanges")}
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <Button
              type="button"
              onClick={onAddQuestion}
              variant="outline"
              className="w-full rounded-xl border-dashed border-2 hover:border-primary hover:text-primary font-semibold py-5"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("addQuestion")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
