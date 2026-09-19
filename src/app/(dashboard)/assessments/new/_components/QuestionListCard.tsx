import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, HelpCircle, Save, Trash2 } from "lucide-react";
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
  onPublish: () => void;
  isSubmitting: boolean;
  editingIndex?: number | null;
}

export function QuestionListCard({
  questions,
  onRemoveQuestion,
  onEditQuestion,
  onPublish,
  isSubmitting,
  editingIndex,
}: QuestionListCardProps) {
  const t = useTranslations("Assessments");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            {t("questionListTitle", { count: questions.length })}
          </CardTitle>
          <CardDescription>
            {t("questionListDesc")}
          </CardDescription>
        </div>
        <Button
          variant="role"
          onClick={onPublish}
          disabled={questions.length === 0 || isSubmitting}
          isLoading={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {t("publishAssessment")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            {t("noQuestionsAdded")}
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={idx}
              className={
                "p-4 rounded-xl bg-muted/40 border border-border/60 flex items-start justify-between gap-4" +
                (editingIndex === idx ? " ring-2 ring-primary" : "")
              }
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-primary">
                    Q{idx + 1}.
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {q.type} ({q.points} pts)
                  </Badge>
                  {editingIndex === idx && (
                    <Badge className="text-[10px]" variant="role">
                      {t("editingBadge")}
                    </Badge>
                  )}
                </div>
                <p className="font-semibold text-sm">{q.question}</p>
                {(q.type === "MCQ" || q.type === "TRUE_FALSE") && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                    {q.options.map((o, i) => (
                      <span
                        key={i}
                        className={o.isCorrect ? "text-success font-bold" : ""}
                      >
                        {o.isCorrect ? "✓ " : ""}
                        {o.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditQuestion(idx)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveQuestion(idx)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
