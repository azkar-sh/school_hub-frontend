import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Submission } from "@/types";

interface SubmissionDetailCardProps {
  submission: Submission;
  currentRole?: string;
  gradeAnswerId: string;
  gradePoints: number;
  onChangeGradePoints: (value: number) => void;
  onStartGrading: (answerId: string, currentPoints?: number) => void;
  onCancelGrading: () => void;
  onSubmitGrade: (e: React.FormEvent) => void;
}

function optionMatches(
  answer: string | undefined,
  opt: { id?: string; text: string },
) {
  if (!answer) return false;
  const a = answer.trim();
  return a === (opt.id ?? "").trim() || a === opt.text.trim();
}

export function SubmissionDetailCard({
  submission,
  currentRole,
  gradeAnswerId,
  gradePoints,
  onChangeGradePoints,
  onStartGrading,
  onCancelGrading,
  onSubmitGrade,
}: SubmissionDetailCardProps) {
  const answers = submission.answers ?? [];
  const hasPendingManual = answers.some(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );

  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Badge variant="role" className="mb-1">
            Submission Detail ({submission.status})
          </Badge>
          <CardTitle className="text-lg">
            {submission.assessment?.title || "Assessment Submission"}
          </CardTitle>
          <CardDescription className="text-xs">
            Student: {submission.student?.name || submission.studentId}
          </CardDescription>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-semibold text-muted-foreground block">
            Score
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {submission.scorePercentage !== undefined &&
            submission.scorePercentage !== null
              ? `${submission.scorePercentage}%`
              : "Pending"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {hasPendingManual && currentRole === "TEACHER" && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Some short-answer questions are awaiting manual grading.
          </div>
        )}

        <div className="space-y-4">
          {answers.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No answers were recorded for this submission.
            </p>
          )}

          {answers.map((ans, idx) => {
            const q = ans.question;
            const earned =
              ans.pointsEarned !== undefined && ans.pointsEarned !== null
                ? Number(ans.pointsEarned)
                : null;
            const isPending = earned === null;
            const isShortAnswer = q?.type === "SHORT_ANSWER";
            const selectedOption = q?.options?.find((o) =>
              optionMatches(ans.answer, o),
            );

            return (
              <div
                key={ans.id}
                className="p-4 rounded-xl bg-card border border-border/60 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {q?.type && (
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {q.type.replace("_", " ").toLowerCase()}
                      </Badge>
                    )}
                    <Badge variant="outline">{q?.points ?? 1} pts</Badge>
                  </div>
                </div>

                <p className="font-semibold text-sm text-foreground">
                  {q?.question || `Question ID: ${ans.questionId}`}
                </p>

                {isShortAnswer ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-border bg-muted/40">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                        Student&apos;s Answer
                      </span>
                      <span className="text-sm">
                        {ans.answer?.trim() ? ans.answer : "No response"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      {isPending ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting manual grading
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          {earned} / {q?.points ?? 1} pts
                        </span>
                      )}
                      {currentRole === "TEACHER" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[11px]"
                          onClick={() => onStartGrading(ans.id, earned ?? undefined)}
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          {isPending ? "Grade Answer" : "Update Grade"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {q?.options?.map((opt) => {
                      const selected = optionMatches(ans.answer, opt);
                      const correct = !!opt.isCorrect;
                      let cls =
                        "border-border/80 bg-background/50 text-foreground";
                      let icon: React.ReactNode = null;

                      if (selected && correct) {
                        cls =
                          "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                        icon = (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        );
                      } else if (selected && !correct) {
                        cls =
                          "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400";
                        icon = <XCircle className="w-4 h-4 text-red-600" />;
                      } else if (!selected && correct) {
                        cls =
                          "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400";
                        icon = (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
                                Student&apos;s pick
                              </span>
                            )}
                            {icon}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="text-muted-foreground">
                        {selectedOption?.isCorrect === true
                          ? "Correct"
                          : "Incorrect"}
                      </span>
                      <span
                        className={`font-semibold ${
                          isPending
                            ? "text-amber-600 dark:text-amber-400"
                            : (earned ?? 0) > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isPending
                          ? "Pending"
                          : `${earned} / ${q?.points ?? 1} pts`}
                      </span>
                    </div>
                  </div>
                )}

                {gradeAnswerId === ans.id && currentRole === "TEACHER" && (
                  <form
                    onSubmit={onSubmitGrade}
                    className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-3"
                  >
                    <h5 className="font-bold text-xs text-foreground">
                      Grade Answer
                    </h5>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={0}
                        max={q?.points ?? undefined}
                        placeholder="Points earned"
                        value={gradePoints}
                        onChange={(e) =>
                          onChangeGradePoints(Number(e.target.value))
                        }
                        className="w-40 text-xs"
                      />
                      <Button type="submit" variant="role" size="sm">
                        Save Points
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancelGrading}
                      >
                        Cancel
                      </Button>
                    </div>
                    {q?.points !== undefined && (
                      <p className="text-[10px] text-muted-foreground">
                        Max points: {q.points}
                      </p>
                    )}
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
