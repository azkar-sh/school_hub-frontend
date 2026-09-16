import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserRound,
  GraduationCap,
  School as SchoolIcon,
  BookOpen,
  Loader2,
} from "lucide-react";
import { MockSchoolAdminOverview } from "@/lib/mock-data";

interface AdminStatsGridProps {
  overview: MockSchoolAdminOverview;
  isLoading?: boolean;
}

export function AdminStatsGrid({ overview, isLoading }: AdminStatsGridProps) {
  const value = (v: number) =>
    isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      v
    );

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Teachers
          </CardTitle>
          <UserRound className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.teachersCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active teaching staff
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Students
          </CardTitle>
          <GraduationCap className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.studentsCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enrolled students
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Classes
          </CardTitle>
          <SchoolIcon className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.classesCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active class sections
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Subjects
          </CardTitle>
          <BookOpen className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {value(overview.subjectsCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered subjects
          </p>
        </CardContent>
      </Card>
    </>
  );
}
