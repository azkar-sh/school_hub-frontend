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
  const autoGradableAnswers = answers.filter(
    (a) => a.question?.type === "MCQ" || a.question?.type === "TRUE_FALSE",
  );
  const manualAnswers = answers.filter(
    (a) => a.question?.type === "SHORT_ANSWER",
  );
  const pendingAuto = autoGradableAnswers.filter(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );
  const pendingManual = manualAnswers.filter(
    (a) => a.pointsEarned === null || a.pointsEarned === undefined,
  );

  return (
      <Card className="border-primary/40 bg-primary/5 overflow-hidden">

        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <div className="min-w-0">
            <Badge variant="role" className="mb-1">
              {submission.status}
            </Badge>
            <CardTitle className="text-base sm:text-xl truncate">
              {submission.assessment?.title || "Assessment Submission"}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 truncate">
              <span className="font-semibold text-foreground">
                {submission.student?.name || submission.studentId}
              </span>
              {submission.assessment?.teachingAssignment?.class?.name && (
                <span>
                  {" "}
                  • {submission.assessment.teachingAssignment.class.name}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-success">
              {submission.scorePercentage !== undefined &&
              submission.scorePercentage !== null
                ? `${submission.scorePercentage}%`
                : "—"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 pt-2 px-3 sm:px-6">
          {pendingAuto.length > 0 && isTeacher && (
            <div className="hidden sm:flex flex-col gap-2.5 p-3 sm:p-3.5 rounded-xl bg-info/10 border border-info/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-info">
                <Wand2 className="w-4 h-4 shrink-0" />
                <span>
                  {pendingAuto.length} MCQ / True-False ungraded
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                className="w-full min-h-[44px] text-sm font-bold gap-2"
                onClick={onAutoGrade}
                disabled={autoGrading}
                isLoading={autoGrading}
              >
                {!autoGrading && <Wand2 className="w-4 h-4" />}
                {autoGrading
                  ? "Auto-grading…"
                  : `Auto-grade ${pendingAuto.length} question${pendingAuto.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          )}

          {pendingManual.length > 0 && isTeacher && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {pendingManual.length} short-answer need{pendingManual.length > 1 ? "" : "s"} manual review below.
              </span>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
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
                  className="p-3 sm:p-5 rounded-xl bg-card border border-border/60 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Q{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {q?.type && (
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-semibold px-1.5"
                        >
                          {q.type === "TRUE_FALSE"
                            ? "TF"
                            : q.type.replace("_", " ").toLowerCase()}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        {maxPts} pts
                      </Badge>
                      {!isPending && (
                        <span
                          className={`text-xs font-black ${
                            earned > 0 ? "text-success" : "text-destructive"
                          }`}
                        >
                          {earned}/{maxPts}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-sm sm:text-base text-foreground mt-1.5 mb-2.5 leading-snug">
                    {q?.question || `Question ID: ${ans.questionId}`}
                  </p>

                  {isShortAnswer ? (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl border border-border bg-muted/40">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1 tracking-wider">
                          Student answer
                        </span>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {ans.answer?.trim() ? ans.answer : "No response"}
                        </p>
                      </div>

                      {isTeacher ? (
                        <div className="rounded-xl bg-muted/50 border border-border/60 p-2.5 sm:p-3.5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-muted-foreground">
                              Grade
                            </span>
                            <span
                              className={`text-sm font-black ${
                                isPending
                                  ? "text-warning"
                                  : earned > 0
                                    ? "text-success"
                                    : "text-destructive"
                              }`}
                            >
                              {isPending ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> Ungraded
                                </span>
                              ) : (
                                `${earned} / ${maxPts}`
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              type="button"
                              variant={earned === 0 ? "destructive" : "outline"}
                              size="sm"
                              className="min-h-[44px] text-xs font-bold"
                              onClick={() => onQuickGrade?.(ans.id, 0)}
                            >
                              0
                            </Button>
                            <Button
                              type="button"
                              variant={
                                earned === Math.round(maxPts / 2)
                                  ? "role"
                                  : "outline"
                              }
                              size="sm"
                              className="min-h-[44px] text-xs font-bold"
                              onClick={() =>
                                onQuickGrade?.(ans.id, Math.round(maxPts / 2))
                              }
                            >
                              {Math.round(maxPts / 2)}
                            </Button>
                            <Button
                              type="button"
                              variant={earned === maxPts ? "role" : "outline"}
                              size="sm"
                              className="min-h-[44px] text-xs font-bold"
                              onClick={() => onQuickGrade?.(ans.id, maxPts)}
                            >
                              {maxPts}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full min-h-[44px] text-xs mt-2"
                            onClick={() =>
                              onStartGrading(ans.id, earned ?? undefined)
                            }
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                            Custom points
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-semibold">
                            {isPending ? (
                              <span className="text-warning inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Pending review
                              </span>
                            ) : (
                              <span className="text-success">
                                {earned} / {maxPts} pts
                              </span>
                            )}
                          </span>
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
                        let icon = null;

                        if (selected && correct) {
                          cls = "border-success/50 bg-success/10 text-success";
                          icon = (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          );
                        } else if (selected && !correct) {
                          cls =
                            "border-destructive/50 bg-destructive/10 text-destructive";
                          icon = (
                            <XCircle className="w-4 h-4 text-destructive shrink-0" />
                          );
                        } else if (!selected && correct) {
                          cls = "border-success/40 bg-success/5 text-success";
                          icon = (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          );
                        }

                        return (
                          <div
                            key={opt.id ?? opt.text}
                            className={`w-full p-3 rounded-xl border text-sm font-medium flex items-center justify-between gap-2 min-h-[48px] ${cls}`}
                          >
                            <span className="leading-snug">{opt.text}</span>
                            <span className="flex items-center gap-2 shrink-0">
                              {selected && (
                                <span className="text-[10px] uppercase font-bold opacity-80 hidden sm:inline">
                                  Pick
                                </span>
                              )}
                              {icon}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between pt-1.5 text-xs">
                        <span className="text-muted-foreground font-medium">
                          {selectedOption?.isCorrect === true
                            ? "Correct"
                            : "Incorrect"}
                          {isPending ? " • ungraded" : ""}
                        </span>

                        <div className="flex items-center gap-2">
                          {isAutoGradable && isTeacher && isPending && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-h-[44px] text-xs font-bold px-3 gap-1.5"
                              onClick={onAutoGrade}
                              disabled={autoGrading}
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              Auto-grade
                            </Button>
                          )}
                          {!isPending && (
                            <span
                              className={`font-bold ${
                                (earned ?? 0) > 0
                                  ? "text-success"
                                  : "text-destructive"
                              }`}
                            >
                              {earned}/{maxPts}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {gradeAnswerId === ans.id && isTeacher && (
                    <form
                      onSubmit={onSubmitGrade}
                      className="mt-3 p-3 sm:p-4 rounded-xl bg-muted/70 border border-primary/30 space-y-3"
                    >
                      <h5 className="font-bold text-xs text-foreground">
                        Custom points — Q{idx + 1} (max {maxPts})
                      </h5>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={maxPts}
                          placeholder="0"
                          value={gradePoints}
                          onChange={(e) =>
                            onChangeGradePoints(Number(e.target.value))
                          }
                          className="flex-1 min-h-[44px] text-base"
                          autoFocus
                          inputMode="numeric"
                        />
                        <Button
                          type="submit"
                          variant="role"
                          size="sm"
                          className="min-h-[44px] px-5 font-bold"
                        >
                          Save
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full min-h-[44px]"
                        onClick={onCancelGrading}
                      >
                        Cancel
                      </Button>
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
