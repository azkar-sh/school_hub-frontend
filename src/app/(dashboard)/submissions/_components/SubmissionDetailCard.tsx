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
  highlightAnswerId?: string | null;
}

function optionMatches(
  answer: string | undefined,
  opt: { id?: string; text: string },
) {
  if (!answer) return false;
  const a = answer.trim();
  return a === (opt.id ?? "").trim() || a === opt.text.trim();
}

const QUICK_GRADE_RATIOS = [
  { ratio: 0, label: "No credit" },
  { ratio: 0.5, label: "Half credit" },
  { ratio: 1, label: "Full credit" },
] as const;

function buildQuickGradePresets(maxPoints: number) {
  const safeMax = Number.isFinite(maxPoints) && maxPoints > 0 ? maxPoints : 1;
  const byPoints = new Map<number, string>();
  for (const { ratio, label } of QUICK_GRADE_RATIOS) {
    byPoints.set(Number((safeMax * ratio).toFixed(2)), label);
  }

  return Array.from(byPoints.entries())
    .map(([points, label]) => ({ points, label }))
    .sort((a, b) => a.points - b.points);
}

function formatPresetPoints(points: number) {
  return Number.isInteger(points)
    ? String(points)
    : points.toFixed(2).replace(/\.?0+$/, "");
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
  highlightAnswerId,
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
  const totalGradable = autoGradableAnswers.length + manualAnswers.length;
  const totalPending = pendingAuto.length + pendingManual.length;
  const gradedCount = totalGradable - totalPending;
  const allGraded = totalGradable > 0 && totalPending === 0;
  const progressPct =
    totalGradable > 0 ? Math.round((gradedCount / totalGradable) * 100) : 100;

  return (
    <Card className="border-primary/40 bg-primary/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge variant="role">{submission.status}</Badge>
            {isTeacher && totalGradable > 0 && (
              <Badge variant={allGraded ? "success" : "warning"}>
                {allGraded
                  ? "Fully graded"
                  : `${gradedCount}/${totalGradable} graded`}
              </Badge>
            )}
          </div>
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
        {isTeacher && totalGradable > 0 && (
          <div
            className={`flex flex-col gap-2.5 p-3 sm:p-3.5 rounded-xl border ${
              allGraded
                ? "bg-success/10 border-success/30"
                : "bg-muted/40 border-border/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex items-center gap-1.5 text-xs font-bold ${
                  allGraded ? "text-success" : "text-foreground"
                }`}
              >
                {allGraded ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 shrink-0 text-warning" />
                )}
                <span>
                  {allGraded
                    ? "All questions graded"
                    : `${gradedCount}/${totalGradable} questions graded`}
                </span>
              </div>
              {!allGraded && (
                <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                  {totalPending} pending
                </span>
              )}
            </div>

            <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  allGraded ? "bg-success" : "bg-info"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {pendingAuto.length > 0 && (
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
                  : `Auto-grade ${pendingAuto.length} MCQ / True-False`}
              </Button>
            )}

            {pendingManual.length > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-warning font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {pendingManual.length} short-answer response
                {pendingManual.length > 1 ? "s" : ""} need manual review below.
              </p>
            )}
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
            const quickGradePresets = buildQuickGradePresets(maxPts);
            const selectedOption = q?.options?.find((o) =>
              optionMatches(ans.answer, o),
            );

            const isHighlighted = ans.id === highlightAnswerId;

            return (
              <div
                key={ans.id}
                id={`answer-${ans.id}`}
                className={`p-3 sm:p-5 rounded-xl bg-card border shadow-xs scroll-mt-36 transition-all ${
                  isHighlighted
                    ? "border-info/60 ring-2 ring-info/50"
                    : isPending && isTeacher
                      ? "border-warning/40 ring-1 ring-warning/20"
                      : "border-border/60"
                }`}
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
                          {quickGradePresets.map(({ points, label }) => {
                            const isSelected =
                              earned !== null &&
                              Math.abs(earned - points) < 0.001;
                            const variant =
                              isSelected && points === 0
                                ? "destructive"
                                : isSelected
                                  ? "role"
                                  : "outline";

                            return (
                              <Button
                                key={`${ans.id}-${points}`}
                                type="button"
                                variant={variant}
                                size="sm"
                                className="min-h-[48px] flex-col gap-0 text-xs font-bold"
                                onClick={() => onQuickGrade?.(ans.id, points)}
                              >
                                <span>{formatPresetPoints(points)} pts</span>
                                <span className="text-[10px] font-medium opacity-70">
                                  {label}
                                </span>
                              </Button>
                            );
                          })}
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
                        step="0.01"
                        placeholder="0"
                        value={gradePoints}
                        onChange={(e) =>
                          onChangeGradePoints(Number(e.target.value))
                        }
                        className="flex-1 min-h-[44px] text-base"
                        autoFocus
                        inputMode="decimal"
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
