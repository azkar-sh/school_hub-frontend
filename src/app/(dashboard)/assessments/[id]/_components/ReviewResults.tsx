import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Assessment, Question, Submission } from "@/types";

interface ReviewResultsProps {
  submission: Submission;
  assessment?: Assessment | null;
  onBack: () => void;
}

function optionMatches(
  answer: string | undefined,
  opt: { id?: string; text: string },
) {
  if (!answer) return false;
  const a = answer.trim();
  return a === (opt.id ?? "").trim() || a === opt.text.trim();
}

export function ReviewResults({
  submission,
  assessment,
  onBack,
}: ReviewResultsProps) {
  const questions: Question[] =
    submission.assessment?.questions ?? assessment?.questions ?? [];
  const answers = submission.answers ?? [];
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const earnedPoints =
    submission.score !== undefined && submission.score !== null
      ? Number(submission.score)
      : 0;
  const pct = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const hasPendingManual = answers.some(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );

  const subjectName = submission.assessment?.teachingAssignment?.subject?.name;
  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString()
    : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Assessments
        </Button>
      </div>

      {/* Score summary */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 shrink-0 rounded-full bg-success/20 text-success flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                {submission.assessment?.title ??
                  assessment?.title ??
                  "Assessment"}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {subjectName ? `${subjectName} • ` : ""}
                Submitted {submittedDate}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-success/15 text-success gap-1 self-start"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {submission.status === "GRADED" ? "Graded" : "Submitted"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Score
              </span>
              <span className="text-2xl font-black text-success">
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Points
              </span>
              <span className="text-2xl font-black">
                {earnedPoints}
                <span className="text-base text-muted-foreground font-semibold">
                  {" "}
                  / {totalPoints}
                </span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Questions
              </span>
              <span className="text-2xl font-black">{questions.length}</span>
            </div>
          </div>

          {hasPendingManual && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Some answers are awaiting manual grading by your teacher, so the
              final score may change once grading is complete.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-question review */}
      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No questions are available to review.
          </div>
        )}

        {questions.map((q, idx) => {
          const ans = answerMap.get(q.id);
          const earned =
            ans?.pointsEarned !== undefined && ans?.pointsEarned !== null
              ? Number(ans.pointsEarned)
              : null;
          const isPending = earned === null;
          const isCorrect = !isPending && earned > 0;

          return (
            <Card key={q.id} className="border-border/60">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Question {idx + 1} of {questions.length}
                  </span>
                  <Badge variant="outline">{q.points ?? 1} Points</Badge>
                </div>
                <CardTitle className="text-lg leading-relaxed">
                  {q.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {q.type === "SHORT_ANSWER" ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-border bg-muted/40">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                        Your Answer
                      </span>
                      <span className="text-sm">
                        {ans?.answer?.trim() ? ans.answer : "No response"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {isPending ? (
                        <span className="flex items-center gap-1 text-warning font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting manual grading
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-medium">
                          {earned} / {q.points ?? 1} pts
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {q.options?.map((opt) => {
                      const selected = optionMatches(ans?.answer, opt);
                      const correct = !!opt.isCorrect;
                      let cls =
                        "border-border/80 bg-background/50 text-foreground";
                      let icon: React.ReactNode = null;

                      if (selected && correct) {
                        cls =
                          "border-success/50 bg-success/10 text-success";
                        icon = (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        );
                      } else if (selected && !correct) {
                        cls =
                          "border-destructive/50 bg-destructive/10 text-destructive";
                        icon = <XCircle className="w-4 h-4 text-destructive" />;
                      } else if (!selected && correct) {
                        cls =
                          "border-success/40 bg-success/5 text-success";
                        icon = (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        );
                      }

                      return (
                        <div
                          key={opt.id ?? opt.text}
                          className={`w-full p-3 rounded-xl border text-sm font-medium flex items-center justify-between ${cls}`}
                        >
                          <span>{opt.text}</span>
                          <span className="flex items-center gap-2">
                            {selected && (
                              <span className="text-[10px] uppercase font-bold opacity-80">
                                Your pick
                              </span>
                            )}
                            {icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground capitalize">
                    {q.type.replace("_", " ").toLowerCase()}
                  </span>
                  {isPending ? (
                    <span className="flex items-center gap-1 text-warning font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  ) : isCorrect ? (
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {earned} / {q.points ?? 1} pts
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      {earned ?? 0} / {q.points ?? 1} pts
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
