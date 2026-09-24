"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft, ArrowRight, Bookmark, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface QuestionCardQuestion {
  id: string;
  question: string;
  points: number;
  type: string;
  options?: { id?: string; text: string; isCorrect?: boolean }[];
}

interface QuestionCardProps {
  assessmentTitle?: string;
  question: QuestionCardQuestion;
  selectedAnswer: string | undefined;
  onSelectOption: (questionId: string, answerText: string) => void;
  isFlagged?: boolean;
  onToggleFlag?: (questionId: string) => void;
  currentIdx: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmittingApi: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionCard({
  assessmentTitle,
  question,
  selectedAnswer,
  onSelectOption,
  isFlagged = false,
  onToggleFlag,
  currentIdx,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  isSubmittingApi,
}: QuestionCardProps) {
  const t = useTranslations("Assessments");
  const isLastQuestion = currentIdx === totalQuestions - 1;

  return (
    <Card className="border-border/70 shadow-sm bg-card/95 backdrop-blur-xs transition-all duration-200">
      <CardHeader className="space-y-3 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-bold">
              {t("questionOf", { current: currentIdx + 1, total: totalQuestions })}
            </span>
            <span className="uppercase tracking-wider truncate max-w-[200px] sm:max-w-md hidden sm:inline-block">
              {assessmentTitle || t("questionDefaultTitle")}
            </span>
          </div>

          <Badge variant="outline" className="font-semibold">
            {t("pointsLabel", { count: question.points || 1 })}
          </Badge>
        </div>

        <CardTitle className="text-lg sm:text-xl font-semibold leading-relaxed pt-1">
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="space-y-3">
          {question.type === "SHORT_ANSWER" ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block uppercase">
                {t("yourResponse")}
              </label>
              <Input
                placeholder={t("typeAnswerHere")}
                value={selectedAnswer || ""}
                onChange={(e) => onSelectOption(question.id, e.target.value)}
                className="h-12 text-base px-4 rounded-xl border-border/80 focus-visible:ring-primary"
              />
            </div>
          ) : (
            question.options?.map((opt, optIdx) => {
              const optVal = opt.id || opt.text;
              const isSelected = selectedAnswer === optVal;
              const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1);

              return (
                <button
                  key={opt.id || opt.text || optIdx}
                  type="button"
                  onClick={() => onSelectOption(question.id, optVal)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left font-medium text-sm transition-all duration-150 flex items-center justify-between group cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-semibold ring-1 ring-primary/40"
                      : "border-border/70 bg-background/60 hover:bg-muted/60 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                    {/* Circle letter badge A, B, C, D */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      {letter}
                    </div>
                    <span className="leading-snug break-words">{opt.text}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-in zoom-in-75 duration-150" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Navigation & Action Footer (Desktop inline; Mobile uses sticky floating dock) */}
        <div className="hidden lg:flex items-center justify-between gap-3 pt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={currentIdx === 0}
            className="rounded-xl px-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>{t("previous")}</span>
          </Button>

          {/* Tandai Ragu-ragu (Flag for Review) Button */}
          {onToggleFlag && (
            <Button
              type="button"
              variant={isFlagged ? "default" : "outline"}
              onClick={() => onToggleFlag(question.id)}
              className={cn(
                "rounded-xl transition-all duration-150 font-semibold gap-2",
                isFlagged
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "border-border text-muted-foreground hover:text-amber-600 hover:border-amber-400"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isFlagged && "fill-current")} />
              <span>{t("flagForReview")}</span>
            </Button>
          )}

          {!isLastQuestion ? (
            <Button
              type="button"
              variant="role"
              onClick={onNext}
              className="rounded-xl px-5 shadow-xs"
            >
              <span>{t("nextQuestion")}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="role"
              onClick={onSubmit}
              className="rounded-xl px-5 shadow-md shadow-primary/25 font-bold gap-2"
              isLoading={isSubmittingApi}
            >
              <Send className="w-4 h-4" />
              <span>{t("finishExam")}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
