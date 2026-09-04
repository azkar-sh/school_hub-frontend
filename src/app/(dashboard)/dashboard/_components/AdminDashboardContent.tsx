import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarDays,
  School as SchoolIcon,
  GraduationCap,
  Activity,
  Loader2,
} from "lucide-react";
import {
  MockSchoolAdminAcademicYear,
  MockRecentActivity,
} from "@/lib/mock-data";

interface AdminDashboardContentProps {
  academicYear: MockSchoolAdminAcademicYear | null;
  recentActivity: MockRecentActivity[];
  isLoading?: boolean;
}

export function AdminDashboardContent({
  academicYear,
  recentActivity,
  isLoading,
}: AdminDashboardContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Academic Year */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Current Academic Year
          </CardTitle>
          <CardDescription>Active term overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading academic year…</span>
            </div>
          ) : academicYear ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {academicYear.name}
                  </span>
                  <Badge
                    variant={academicYear.status === "Active" ? "role" : "outline"}
                    className="ml-2"
                  >
                    {academicYear.status}
                  </Badge>
                </div>
                <Link href="/academic-years">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-primary"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <SchoolIcon className="w-4 h-4" />
                    <span>Classes</span>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground mt-1">
                    {academicYear.classesCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>Students</span>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground mt-1">
                    {academicYear.studentsCount}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No academic year found for your school yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest school events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading activity…</span>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No recent activity yet.
            </div>
          ) : (
            recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex flex-col gap-1 pb-3 border-b border-border/40 last:border-0 last:pb-0"
              >
                <p className="text-xs font-semibold text-foreground">
                  {act.action}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{act.user}</span>
                  <span>{act.time}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
