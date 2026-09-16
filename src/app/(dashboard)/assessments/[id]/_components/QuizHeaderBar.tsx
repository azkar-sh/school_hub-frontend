import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";

interface QuizHeaderBarProps {
  onBack: () => void;
  timeFormatted: string;
  currentIdx: number;
  totalQuestions: number;
}

export function QuizHeaderBar({
  onBack,
  timeFormatted,
  currentIdx,
  totalQuestions,
}: QuizHeaderBarProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-sm">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-bold text-sm text-warning">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Time Left: {timeFormatted}</span>
        </div>
        <Badge variant="role">
          Question {currentIdx + 1} of {totalQuestions}
        </Badge>
      </div>
    </div>
  );
}
