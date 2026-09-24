"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, CheckCircle2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface QuizHeaderBarProps {
  assessmentTitle?: string;
  onOpenExitModal: () => void;
  timeFormatted: string;
  timeLeft?: number;
  currentIdx: number;
  totalQuestions: number;
  onToggleMobilePalette?: () => void;
}

export function QuizHeaderBar({
  assessmentTitle,
  onOpenExitModal,
  timeFormatted,
  timeLeft = 600,
  currentIdx,
  totalQuestions,
  onToggleMobilePalette,
}: QuizHeaderBarProps) {
  const t = useTranslations("Assessments");

  const isCritical = timeLeft <= 60;
  const isWarning = timeLeft <= 300 && !isCritical;

  return (
    <header className="sticky top-0 z-30 p-3 sm:p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xs flex items-center justify-between gap-3">
      {/* Left: Exit button & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenExitModal}
          className="rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">{t("confirmExit")}</span>
        </Button>

        <div className="h-5 w-px bg-border/60 hidden sm:block shrink-0" />

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate max-w-[150px] sm:max-w-xs md:max-w-md">
            {assessmentTitle || "CBT Assessment"}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>
              {t("questionOf", { current: currentIdx + 1, total: totalQuestions })}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Autosave status, Timer, Mobile Palette Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Autosave micro-pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t("autoSaved")}</span>
        </div>

        {/* Timer */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold tracking-tight transition-colors",
            isCritical
              ? "bg-destructive/15 border-destructive/40 text-destructive animate-pulse"
              : isWarning
              ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
              : "bg-muted/60 border-border/80 text-foreground"
          )}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span className="tabular-nums font-mono">{timeFormatted}</span>
        </div>

        {/* Mobile Palette Button */}
        {onToggleMobilePalette && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleMobilePalette}
            className="lg:hidden rounded-xl gap-1.5 px-2.5"
            title={t("questionPalette")}
          >
            <LayoutGrid className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold hidden xs:inline">{t("questionPalette")}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
