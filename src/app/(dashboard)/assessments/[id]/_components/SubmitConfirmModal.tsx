"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Bookmark, Send, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting: boolean;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  unansweredCount: number;
}

export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  totalQuestions,
  answeredCount,
  flaggedCount,
  unansweredCount,
}: SubmitConfirmModalProps) {
  const t = useTranslations("Assessments");
  const hasWarnings = unansweredCount > 0 || flaggedCount > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 gap-4 rounded-3xl">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                hasWarnings
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {hasWarnings ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg font-bold leading-tight">
                {t("confirmSubmitTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {t("confirmSubmitDesc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Stats breakdown */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
          {/* Answered */}
          <div className="p-2.5 sm:p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{t("answered")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              {answeredCount}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {totalQuestions}
            </span>
          </div>

          {/* Flagged / Ragu-ragu */}
          <div className="p-2.5 sm:p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{t("flagged")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
              {flaggedCount}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
              {t("flagForReview")}
            </span>
          </div>

          {/* Unanswered */}
          <div className="p-2.5 sm:p-3 rounded-2xl border border-border/70 bg-muted/30 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground">
              <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{t("unanswered")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
              {unansweredCount}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Warning or Success Message */}
        {hasWarnings ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Perhatian Sebelum Mengumpulkan:</span>
            </p>
            {unansweredCount > 0 && (
              <p className="pl-5 text-muted-foreground dark:text-amber-200/80">
                • {t("unansweredWarning", { count: unansweredCount })}
              </p>
            )}
            {flaggedCount > 0 && (
              <p className="pl-5 text-muted-foreground dark:text-amber-200/80">
                • {t("flaggedWarning", { count: flaggedCount })}
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{t("allAnsweredGood")}</span>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px] rounded-xl font-medium"
          >
            {t("reviewAnswersAction")}
          </Button>
          <Button
            type="button"
            variant="role"
            onClick={onConfirmSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-h-[44px] rounded-xl font-bold shadow-md shadow-primary/20 gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{t("confirmSubmitAction")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
