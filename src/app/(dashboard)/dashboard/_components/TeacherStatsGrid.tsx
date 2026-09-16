import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School as SchoolIcon,
  FileCheck2,
  Clock,
  BarChart3,
  Loader2,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";

interface TeacherStatsGridProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  liveAssessmentsCount: number;
  pendingResults: number;
  classAverage: number | null;
  isLoading?: boolean;
}

export function TeacherStatsGrid({
  isDemoMode,
  teacherClasses,
  liveAssessmentsCount,
  pendingResults,
  classAverage,
  isLoading,
}: TeacherStatsGridProps) {
  const num = (v: number, fallback = 0) =>
    isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      v ?? fallback
    );

  const myClassesCount = teacherClasses.length;
  const assessmentsCount = isDemoMode ? 8 : liveAssessmentsCount;
  const pendingCount = isDemoMode ? 14 : pendingResults;
  const avg = isDemoMode ? 86.4 : classAverage;

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            My Classes
          </CardTitle>
          <SchoolIcon className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {num(myClassesCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Teaching assignments
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Assessments
          </CardTitle>
          <FileCheck2 className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {num(assessmentsCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quizzes &amp; exams published
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Pending Results
          </CardTitle>
          <Clock className="w-4 h-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-warning">
            {num(pendingCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Submissions waiting review
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Class Average
          </CardTitle>
          <BarChart3 className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : avg === null ? (
              "—"
            ) : (
              `${avg}%`
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across graded submissions
          </p>
        </CardContent>
      </Card>
    </>
  );
}
