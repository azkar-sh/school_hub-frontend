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
import { Edit3 } from "lucide-react";
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
            {submission.score !== undefined && submission.score !== null
              ? `${submission.score}%`
              : "Pending"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Student Answers & Grades
        </h4>
        <div className="space-y-3">
          {submission.answers?.map((ans) => (
            <div
              key={ans.id}
              className="p-3.5 rounded-xl bg-card border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  {ans.question?.question || `Question ID: ${ans.questionId}`}
                </p>
                <p className="text-muted-foreground">
                  Submitted Answer:{" "}
                  <span className="font-bold text-foreground">
                    {ans.answer}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  Points:{" "}
                  {ans.pointsEarned !== undefined ? ans.pointsEarned : "Auto"}
                </Badge>
                {currentRole === "TEACHER" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[11px]"
                    onClick={() => onStartGrading(ans.id, ans.pointsEarned)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    Grade Answer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Manual Grade Input Form */}
        {gradeAnswerId && currentRole === "TEACHER" && (
          <form
            onSubmit={onSubmitGrade}
            className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-3"
          >
            <h5 className="font-bold text-xs text-foreground">
              Grade Answer ({gradeAnswerId})
            </h5>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                placeholder="Points earned"
                value={gradePoints}
                onChange={(e) => onChangeGradePoints(Number(e.target.value))}
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
          </form>
        )}
      </CardContent>
    </Card>
  );
}
