import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  School as SchoolIcon,
  Users,
  FileCheck2,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";
import { DisplayAssessment } from "../hooks";
import { UpcomingAssessmentsCard } from "./UpcomingAssessmentsCard";

interface TeacherDashboardContentProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  isLoadingLive: boolean;
  liveFetchError: unknown;
  displayAssessments: DisplayAssessment[];
}

export function TeacherDashboardContent({
  isDemoMode,
  teacherClasses,
  isLoadingLive,
  liveFetchError,
  displayAssessments,
}: TeacherDashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* My Classes — Tree: Class Name, Subject, Student Count, Assessment Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>
              Classes you are currently teaching
            </CardDescription>
          </div>
          <Link href="/classes">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {isDemoMode ? (
            teacherClasses.map((cls) => (
              <div
                key={`${cls.id}-${cls.subject}`}
                className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <SchoolIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Class {cls.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {cls.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {cls.studentCount} students
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {cls.assessmentCount} assessments
                  </span>
                  <Link href="/classes">
                    <Button variant="role" size="sm" className="text-xs">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No classes assigned yet.
            </div>
          )}
        </CardContent>
      </Card>

      <UpcomingAssessmentsCard
        title="Upcoming Assessments"
        description="Assessments you have created and published"
        isLoadingLive={isLoadingLive}
        liveFetchError={liveFetchError}
        isDemoMode={isDemoMode}
        assessments={displayAssessments}
        variant="teacher"
      />
    </div>
  );
}
