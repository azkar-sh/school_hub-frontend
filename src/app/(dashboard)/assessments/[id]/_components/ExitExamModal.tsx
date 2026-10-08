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
import { AlertCircle, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

interface ExitExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export function ExitExamModal({
  isOpen,
  onClose,
  onConfirmExit,
}: ExitExamModalProps) {
  const t = useTranslations("Assessments");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {t("exitExamTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("exitExamDesc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            {t("stayInExam")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirmExit}
            className="flex-1 sm:flex-none gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("confirmExit")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
