import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileCheck2,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface StudentStatsGridProps {
  isDemoMode: boolean;
  liveAssessmentsCount: number;
}

export function StudentStatsGrid({
  isDemoMode,
  liveAssessmentsCount,
}: StudentStatsGridProps) {
  return (
    <>
      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Quizzes Taken
          </CardTitle>
          <FileCheck2 className="w-4 h-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {isDemoMode ? 12 : liveAssessmentsCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{isDemoMode ? "+3 this week" : "from your account"}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Average Score
          </CardTitle>
          <Award className="w-4 h-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            92.5%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Grade A (Honor Roll)
          </p>
        </CardContent>
      </Card>

      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Pending Due
          </CardTitle>
          <Clock className="w-4 h-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-amber-500">2</div>
          <p className="text-xs text-muted-foreground mt-1">
            Math & Science Exams
          </p>
        </CardContent>
      </Card>

      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Study Streak
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-500">5 Days</div>
          <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
        </CardContent>
      </Card>
    </>
  );
}
