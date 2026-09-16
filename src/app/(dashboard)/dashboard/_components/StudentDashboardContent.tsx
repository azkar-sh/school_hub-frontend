import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  School as SchoolIcon,
  GraduationCap,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { MockStudentClassInfo, MockRecentResult } from "@/lib/mock-data";
import { DisplayAssessment } from "../hooks";
import { UpcomingAssessmentsCard } from "./UpcomingAssessmentsCard";
import { RecentResultsCard } from "./RecentResultsCard";

interface StudentDashboardContentProps {
  isDemoMode: boolean;
  studentClass: MockStudentClassInfo | null;
  isLoading: boolean;
  isLoadingLive: boolean;
  liveFetchError: unknown;
  displayAssessments: DisplayAssessment[];
  studentRecentResults: MockRecentResult[];
}

export function StudentDashboardContent({
  isDemoMode,
  studentClass,
  isLoading,
  isLoadingLive,
  liveFetchError,
  displayAssessments,
  studentRecentResults,
}: StudentDashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* My Class — Tree: class info card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-primary" />
            My Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !isDemoMode ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading your class…</span>
            </div>
          ) : studentClass ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">
                    Class {studentClass.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Grade {studentClass.grade} • {studentClass.academicYear}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Homeroom: {studentClass.homeroomTeacher}
                  </p>
                </div>
              </div>
              <Link href="/assessments">
                <Button variant="role" size="sm">
                  <FileCheck2 className="w-4 h-4 mr-1.5" />
                  View Assessments
                </Button>
              </Link>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You are not enrolled in a class for the current academic year.
            </div>
          )}
        </CardContent>
      </Card>

      <UpcomingAssessmentsCard
        title="Upcoming Assessments"
        description="Practice tests and graded class examinations"
        isLoadingLive={isLoadingLive}
        liveFetchError={liveFetchError}
        isDemoMode={isDemoMode}
        assessments={displayAssessments}
        variant="student"
      />

      <RecentResultsCard
        description="Your latest graded assessments"
        results={studentRecentResults}
        isLoading={!isDemoMode && isLoading}
      />
    </div>
  );
}
