import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft, ArrowRight, Send } from "lucide-react";

// Shared shape covering both backend `Question` and demo `PlayerQuestion`.
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
  currentIdx: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmittingApi: boolean;
}

export function QuestionCard({
  assessmentTitle,
  question,
  selectedAnswer,
  onSelectOption,
  currentIdx,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  isSubmittingApi,
}: QuestionCardProps) {
  const isLastQuestion = currentIdx === totalQuestions - 1;

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span className="uppercase tracking-wider">
            {assessmentTitle || "Assessment Quiz"}
          </span>
          <Badge variant="outline">{question.points || 1} Points</Badge>
        </div>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="space-y-3">
          {question.type === "SHORT_ANSWER" ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block uppercase">
                Your Written Response
              </label>
              <Input
                placeholder="Type your answer here..."
                value={selectedAnswer || ""}
                onChange={(e) => onSelectOption(question.id, e.target.value)}
              />
            </div>
          ) : (
            question.options?.map((opt) => {
              const optVal = opt.id || opt.text;
              const isSelected = selectedAnswer === optVal;

              return (
                <button
                  key={opt.id || opt.text}
                  onClick={() => onSelectOption(question.id, optVal)}
                  className={`w-full p-4 rounded-xl border text-left font-medium text-sm transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm font-semibold"
                      : "border-border/80 bg-background/50 hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={currentIdx === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {!isLastQuestion ? (
            <Button variant="role" onClick={onNext}>
              Next Question
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="role"
              onClick={onSubmit}
              className="shadow-md"
              isLoading={isSubmittingApi}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
