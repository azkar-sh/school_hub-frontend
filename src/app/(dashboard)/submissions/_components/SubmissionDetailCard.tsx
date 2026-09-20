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
  Wand2,
  Loader2,
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
  onQuickGrade?: (answerId: string, points: number) => void;
  onAutoGrade?: () => void;
  autoGrading?: boolean;
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
  onQuickGrade,
  onAutoGrade,
  autoGrading,
}: SubmissionDetailCardProps) {
  const answers = submission.answers ?? [];
  const isTeacher = currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";
  const hasPendingManual = answers.some(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );
  const autoGradableAnswers = answers.filter(
    (a) => a.question?.type === "MCQ" || a.question?.type === "TRUE_FALSE",
  );
  const hasPendingAuto = autoGradableAnswers.some(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );

  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="role" className="mb-1">
            Submission Detail ({submission.status})
          </Badge>
          <CardTitle className="text-xl">
            {submission.assessment?.title || "Assessment Submission"}
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Student: <span className="font-semibold text-foreground">{submission.student?.name || submission.studentId}</span>
            {submission.assessment?.teachingAssignment?.class?.name && (
              <span> • {submission.assessment.teachingAssignment.class.name}</span>
            )}
          </CardDescription>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
          <span className="text-xs uppercase font-semibold text-muted-foreground block">
            Overall Score
          </span>
          <span className="text-3xl font-black text-success">
            {submission.scorePercentage !== undefined &&
            submission.scorePercentage !== null
              ? `${submission.scorePercentage}%`
              : "Pending"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {hasPendingManual && isTeacher && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Short-answer questions require manual review. Use the quick presets below to grade in 1 click.</span>
          </div>
        )}
        {hasPendingAuto && isTeacher && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-info/10 border border-info/30 text-xs text-info font-medium">
            <span className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 shrink-0" />
              Some MCQ / True-False answers are ungraded.
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold"
              onClick={onAutoGrade}
              disabled={autoGrading}
            >
              {autoGrading ? "Grading…" : "Auto-grade now"}
            </Button>
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
            const maxPts = q?.points ?? 1;
            const earned =
              ans.pointsEarned !== undefined && ans.pointsEarned !== null
                ? Number(ans.pointsEarned)
                : null;
            const isPending = earned === null;
            const isShortAnswer = q?.type === "SHORT_ANSWER";
            const isAutoGradable =
              q?.type === "MCQ" || q?.type === "TRUE_FALSE";
            const selectedOption = q?.options?.find((o) =>
              optionMatches(ans.answer, o),
            );

            return (
              <div
                key={ans.id}
                className="p-4 sm:p-5 rounded-xl bg-card border border-border/60 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {q?.type && (
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-semibold"
                      >
                        {q.type.replace("_", " ").toLowerCase()}
                      </Badge>
                    )}
                    <Badge variant="outline">{maxPts} pts</Badge>
                  </div>
                </div>

                <p className="font-semibold text-sm sm:text-base text-foreground">
                  {q?.question || `Question ID: ${ans.questionId}`}
                </p>

                {isShortAnswer ? (
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1 tracking-wider">
                        Student&apos;s Submitted Answer
                      </span>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {ans.answer?.trim() ? ans.answer : "No response"}
                      </p>
                    </div>

                    {/* Teacher Manual Grading Action Strip */}
                    {isTeacher ? (
                      <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            Score:
                          </span>
                          <span
                            className={`text-sm font-black ${
                              isPending
                                ? "text-warning flex items-center gap-1"
                                : earned > 0
                                  ? "text-success"
                                  : "text-destructive"
                            }`}
                          >
                            {isPending ? (
                              <>
                                <Clock className="w-3.5 h-3.5 inline" /> Ungraded
                              </>
                            ) : (
                              `${earned} / ${maxPts} pts`
                            )}
                          </span>
                        </div>

                        {/* 1-Click Fast Scoring Presets */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-muted-foreground font-medium hidden md:inline">
                            Quick Grade:
                          </span>
                          <Button
                            type="button"
                            variant={earned === 0 ? "destructive" : "outline"}
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-lg"
                            onClick={() => onQuickGrade?.(ans.id, 0)}
                          >
                            0 pts
                          </Button>
                          <Button
                            type="button"
                            variant={
                              earned === Math.round(maxPts / 2)
                                ? "role"
                                : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-lg"
                            onClick={() =>
                              onQuickGrade?.(ans.id, Math.round(maxPts / 2))
                            }
                          >
                            50% ({Math.round(maxPts / 2)})
                          </Button>
                          <Button
                            type="button"
                            variant={earned === maxPts ? "role" : "outline"}
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-lg"
                            onClick={() => onQuickGrade?.(ans.id, maxPts)}
                          >
                            Full ({maxPts} pts)
                          </Button>

                          {/* Custom input toggle */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() =>
                              onStartGrading(ans.id, earned ?? undefined)
                            }
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            Custom
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Read-only view for Student and Parent */
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-muted-foreground">Status</span>
                        <div className="font-semibold">
                          {isPending ? (
                            <span className="text-warning flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Pending Teacher Review
                            </span>
                          ) : (
                            <span className="text-success">
                              {earned} / {maxPts} pts
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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

                      <div className="flex items-center gap-2">
                        {isAutoGradable && isTeacher && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[11px]"
                            onClick={onAutoGrade}
                            disabled={autoGrading}
                          >
                            <Wand2 className="w-3.5 h-3.5 mr-1" />
                            Auto
                          </Button>
                        )}
                        <div
                          className={`font-semibold ${
                            isPending
                              ? "text-warning"
                              : (earned ?? 0) > 0
                                ? "text-success"
                                : "text-destructive"
                          }`}
                        >
                          {isPending
                            ? "Pending and ready to grade"
                            : `${earned} / ${maxPts} pts`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {gradeAnswerId === ans.id && isTeacher && (
                  <form
                    onSubmit={onSubmitGrade}
                    className="p-4 rounded-xl bg-muted/70 border border-primary/30 space-y-3 animate-in fade-in duration-200"
                  >
                    <h5 className="font-bold text-xs text-foreground">
                      Custom Points for Question {idx + 1}
                    </h5>
                    <div className="flex flex-wrap items-center gap-3">
                      <Input
                        type="number"
                        min={0}
                        max={maxPts}
                        placeholder="Points earned"
                        value={gradePoints}
                        onChange={(e) =>
                          onChangeGradePoints(Number(e.target.value))
                        }
                        className="w-32 text-xs"
                        autoFocus
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
                      <span className="text-[11px] text-muted-foreground">
                        Max points: {maxPts} (Press Enter to save)
                      </span>
                    </div>
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

