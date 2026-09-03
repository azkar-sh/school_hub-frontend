import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolIcon, FileCheck2, Clock, BarChart3 } from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";

interface TeacherStatsGridProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  liveAssessmentsCount: number;
}

export function TeacherStatsGrid({
  isDemoMode,
  teacherClasses,
  liveAssessmentsCount,
}: TeacherStatsGridProps) {
  return (
    <>
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            My Classes
          </CardTitle>
          <SchoolIcon className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {isDemoMode ? teacherClasses.length : 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Teaching assignments
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Assessments
          </CardTitle>
          <FileCheck2 className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {isDemoMode ? 8 : liveAssessmentsCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quizzes & exams published
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Pending Results
          </CardTitle>
          <Clock className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-amber-500">14</div>
          <p className="text-xs text-muted-foreground mt-1">
            Submissions waiting review
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Class Average
          </CardTitle>
          <BarChart3 className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-500">86.4%</div>
          <p className="text-xs text-muted-foreground mt-1">
            +2.1% from last term
          </p>
        </CardContent>
      </Card>
    </>
  );
}
