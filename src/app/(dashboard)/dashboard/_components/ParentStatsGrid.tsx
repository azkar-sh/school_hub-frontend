import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { MockParentChild } from "@/lib/mock-data";

interface ParentStatsGridProps {
  parentChildren: MockParentChild[];
  studentClassGrade: number;
  avgScore: number | null;
  completedCount: number;
  isLoading?: boolean;
}

export function ParentStatsGrid({
  parentChildren,
  studentClassGrade,
  avgScore,
  completedCount,
  isLoading,
}: ParentStatsGridProps) {
  const num = (v: number) =>
    isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      v
    );

  return (
    <>
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Children Linked
          </CardTitle>
          <Users className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {num(parentChildren.length)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {parentChildren[0]?.name ?? "No children"}
            {studentClassGrade ? ` (Grade ${studentClassGrade})` : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Child GPA / Avg
          </CardTitle>
          <Award className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : avgScore === null ? (
              "—"
            ) : (
              `${avgScore}%`
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across graded assessments
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Completed Tests
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-500">
            {num(completedCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted assessments
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Attendance
          </CardTitle>
          <GraduationCap className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">98%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Perfect attendance badge
          </p>
        </CardContent>
      </Card>
    </>
  );
}
