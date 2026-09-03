import { CheckCircle2, AlertCircle } from "lucide-react";

interface FeedbackBannerProps {
  feedback: { type: "success" | "error"; message: string };
}

export function FeedbackBanner({ feedback }: FeedbackBannerProps) {
  return (
    <div
      className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-medium ${
        feedback.type === "success"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 border-destructive/30 text-destructive"
      }`}
    >
      {feedback.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span>{feedback.message}</span>
    </div>
  );
}
