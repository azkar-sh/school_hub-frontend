"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, CheckCircle2, Circle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIdx: number;
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: Set<string>;
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
  onOpenSubmitModal: () => void;
  isSubmittingApi?: boolean;
}

export function QuestionPalette({
  totalQuestions,
  currentIdx,
  selectedAnswers,
  flaggedQuestionIds,
  questionIds,
  onSelectQuestion,
  onOpenSubmitModal,
  isSubmittingApi,
}: QuestionPaletteProps) {
  const t = useTranslations("Assessments");

  return (
    <Card className="border-border/70 shadow-sm flex flex-col h-full bg-card/90 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("questionPalette")}
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {questionIds.length} {t("questionsLabel")}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Grid of Numbers */}
        <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
          {questionIds.map((qId, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered =
              selectedAnswers[qId] !== undefined &&
              selectedAnswers[qId] !== null &&
              String(selectedAnswers[qId]).trim() !== "";
            const isFlagged = flaggedQuestionIds.has(qId);

            // Priority: Flagged has distinct amber look, answered is green, unanswered is neutral
            let buttonStyle = "bg-muted/40 border-border/70 text-foreground hover:bg-muted";

            if (isFlagged) {
              buttonStyle =
                "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/25";
            } else if (isAnswered) {
              buttonStyle =
                "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-500/25";
            }

            return (
              <button
                key={qId || idx}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={cn(
                  "relative h-10 w-full rounded-xl border text-sm font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer",
                  buttonStyle,
                  isCurrent &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary scale-[1.03] shadow-xs"
                )}
              >
                <span>{idx + 1}</span>

                {/* Flag bookmark micro-indicator */}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Bookmark className="w-2.5 h-2.5 fill-current" />
                  </span>
                )}

                {/* Answered micro-indicator if not flagged */}
                {!isFlagged && isAnswered && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 shrink-0" />
              <span>{t("answered")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500 shrink-0" />
              <span>{t("flagged")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-muted/60 border border-border shrink-0" />
              <span>{t("unanswered")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md ring-2 ring-primary ring-offset-1 border border-primary shrink-0" />
              <span>{t("currentQuestion")}</span>
            </div>
          </div>
        </div>

        {/* Big Finish Exam CTA */}
        <Button
          type="button"
          variant="role"
          size="lg"
          onClick={onOpenSubmitModal}
          disabled={isSubmittingApi}
          isLoading={isSubmittingApi}
          className="w-full font-bold shadow-md shadow-primary/20 gap-2 mt-2"
        >
          <Send className="w-4 h-4" />
          <span>{t("finishExam")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
