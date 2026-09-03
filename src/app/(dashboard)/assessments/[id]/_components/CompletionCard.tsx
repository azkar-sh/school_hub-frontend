import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

interface CompletionCardProps {
  calculatedScore: number | null;
  onTryAgain: () => void;
  onReturnToDashboard: () => void;
}

export function CompletionCard({
  calculatedScore,
  onTryAgain,
  onReturnToDashboard,
}: CompletionCardProps) {
  return (
    <Card className="text-center py-10 px-6 space-y-4 border-emerald-500/30 bg-emerald-500/5">
      <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
        <Award className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black">Assessment Complete! 🎉</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Your answers have been processed by the backend auto-grading engine.
      </p>

      <div className="p-4 rounded-2xl bg-card border border-border inline-block min-w-50">
        <span className="text-xs uppercase font-semibold text-muted-foreground block">
          Final Score
        </span>
        <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {calculatedScore !== null
            ? `${calculatedScore.toFixed(1)}%`
            : "Graded"}
        </span>
      </div>

      <div className="pt-4 flex justify-center gap-3">
        <Button variant="outline" onClick={onTryAgain}>
          Try Again
        </Button>
        <Button variant="role" onClick={onReturnToDashboard}>
          Return to Dashboard
        </Button>
      </div>
    </Card>
  );
}
