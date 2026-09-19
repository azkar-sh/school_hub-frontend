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
  Loader2,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";
import { DisplayAssessment } from "../hooks";
import { UpcomingAssessmentsCard } from "./UpcomingAssessmentsCard";
import { useTranslations } from "next-intl";

interface TeacherDashboardContentProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  isLoading: boolean;
  isLoadingLive: boolean;
  liveFetchError: unknown;
  displayAssessments: DisplayAssessment[];
}

export function TeacherDashboardContent({
  isDemoMode,
  teacherClasses,
  isLoading,
  isLoadingLive,
  liveFetchError,
  displayAssessments,
}: TeacherDashboardContentProps) {
  const t = useTranslations("Dashboard.teacherContent");
  return (
    <div className="space-y-6">
      {/* My Classes — Tree: Class Name, Subject, Student Count, Assessment Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("myClasses")}</CardTitle>
            <CardDescription>
              {t("classesYouTeach")}
            </CardDescription>
          </div>
          <Link href="/classes">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              <span>{t("viewAll")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && !isDemoMode ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t("loadingClasses")}</span>
            </div>
          ) : teacherClasses.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {t("noClasses")}
            </div>
          ) : (
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
                      {t("classPrefix", { name: cls.name })}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {cls.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {t("studentsCount", { count: cls.studentCount })}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {t("assessmentsCount", { count: cls.assessmentCount })}
                  </span>
                  <Link href="/classes">
                    <Button variant="role" size="sm" className="text-xs">
                      {t("manage")}
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <UpcomingAssessmentsCard
        title={t("upcomingAssessments")}
        description={t("upcomingDesc")}
        isLoadingLive={isLoadingLive}
        liveFetchError={liveFetchError}
        isDemoMode={isDemoMode}
        assessments={displayAssessments}
        variant="teacher"
      />
    </div>
  );
}
