import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  HelpCircle,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DraftQuestion {
  subTopicId: string;
  question: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  points: number;
  options: Array<{ text: string; isCorrect: boolean }>;
}

interface QuestionListCardProps {
  questions: DraftQuestion[];
  onRemoveQuestion: (index: number) => void;
  onEditQuestion: (index: number) => void;
  onMoveQuestionUp?: (index: number) => void;
  onMoveQuestionDown?: (index: number) => void;
  onPublish: () => void;
  isSubmitting: boolean;
  editingIndex?: number | null;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionListCard({
  questions,
  onRemoveQuestion,
  onEditQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onPublish,
  isSubmitting,
  editingIndex,
}: QuestionListCardProps) {
  const t = useTranslations("Assessments");

  const totalPoints = React.useMemo(() => {
    return questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  }, [questions]);

  const isExact100 = totalPoints === 100;
  const isLessThan100 = totalPoints < 100;

  return (
    <Card className="border border-border/80 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">
              {t("questionListTitle", { count: questions.length })}
            </CardTitle>
            <Badge variant="outline" className="font-bold text-xs">
              Total {totalPoints} Poin
            </Badge>
          </div>
          <CardDescription className="mt-1">
            {t("questionListDesc")}
          </CardDescription>
        </div>

        <Button
          variant="role"
          onClick={onPublish}
          disabled={questions.length === 0 || isSubmitting}
          isLoading={isSubmitting}
          className="shadow-sm font-semibold rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          {t("publishAssessment")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 100-Point Scale Tracker Banner */}
        {questions.length > 0 && (
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isExact100
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : isLessThan100
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isExact100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isLessThan100 ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  {isExact100
                    ? "Skala 100 Poin Tercapai"
                    : isLessThan100
                      ? `Target Skala 100 Poin (${totalPoints}/100 pts)`
                      : `Total Bobot: ${totalPoints} Poin`}
                </span>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {isExact100
                    ? "Total bobot soal sudah genap 100 poin. Penilaian siap dipublikasikan ke siswa."
                    : isLessThan100
                      ? `Masih kurang ${100 - totalPoints} poin untuk mencapai bobot standar ujian skala 100.`
                      : "Total poin melebihi skala 100. Sistem tetap dapat menghitung persentase secara proporsional."}
                </p>
              </div>
            </div>

            {/* Quick point progress bar */}
            <div className="flex items-center gap-2 min-w-[140px] sm:justify-end">
              <div className="w-full sm:w-28 h-2 rounded-full bg-background/50 overflow-hidden border border-black/5 dark:border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isExact100
                      ? "bg-emerald-600"
                      : isLessThan100
                        ? "bg-amber-500"
                        : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min(totalPoints, 100)}%` }}
                />
              </div>
              <span className="font-bold text-xs shrink-0">
                {totalPoints}/100
              </span>
            </div>
          </div>
        )}

        {/* Question List Items */}
        {questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs rounded-xl border border-dashed border-border/70 p-8">
            <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <p className="font-medium text-sm text-foreground mb-1">
              {t("noQuestionsAdded")}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Gunakan formulir pembuat soal di atas atau import template Excel (.xlsx) untuk menambahkan pertanyaan.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  editingIndex === idx
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/70 bg-card hover:border-border hover:shadow-xs"
                }`}
              >
                {/* Reorder Buttons (Move Up / Down) */}
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onMoveQuestionUp?.(idx)}
                    disabled={idx === 0}
                    title="Pindahkan ke atas"
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-25"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-xs text-muted-foreground/80 font-mono">
                    {idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onMoveQuestionDown?.(idx)}
                    disabled={idx === questions.length - 1}
                    title="Pindahkan ke bawah"
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-25"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Question Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[11px] font-semibold">
                      {q.type === "MCQ"
                        ? "Pilihan Ganda"
                        : q.type === "TRUE_FALSE"
                          ? "Benar / Salah"
                          : "Esai Singkat"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-bold text-primary"
                    >
                      {q.points} Poin
                    </Badge>
                    {editingIndex === idx && (
                      <Badge className="text-[10px]" variant="role">
                        {t("editingBadge")}
                      </Badge>
                    )}
                  </div>

                  <p className="font-semibold text-sm text-foreground break-words">
                    {q.question}
                  </p>

                  {/* Options Preview with Letter Badges */}
                  {(q.type === "MCQ" || q.type === "TRUE_FALSE") && (
                    <div className="flex flex-wrap gap-2 text-xs pt-1">
                      {q.options.map((o, i) => {
                        const letter = OPTION_LETTERS[i] || String(i + 1);
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                              o.isCorrect
                                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold"
                                : "bg-muted/60 text-muted-foreground border border-border/40"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                                o.isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {q.type === "MCQ" ? letter : o.text[0]}
                            </span>
                            <span className="truncate max-w-[200px]">{o.text}</span>
                            {o.isCorrect && (
                              <span className="text-[10px] text-emerald-600 font-bold ml-0.5">
                                ✓
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Edit & Remove Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditQuestion(idx)}
                    title="Edit pertanyaan"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveQuestion(idx)}
                    title="Hapus pertanyaan"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
