import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, CheckCircle2, GraduationCap } from "lucide-react";
import { MockParentChild } from "@/lib/mock-data";

interface ParentStatsGridProps {
  parentChildren: MockParentChild[];
  studentClassGrade: number;
}

export function ParentStatsGrid({
  parentChildren,
  studentClassGrade,
}: ParentStatsGridProps) {
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
            {parentChildren.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {parentChildren[0]?.name} (Grade {studentClassGrade})
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
            92.5%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Grade 10 Class Rank #3
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
            12 / 14
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            85% Completion rate
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
