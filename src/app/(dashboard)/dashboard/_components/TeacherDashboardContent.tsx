import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  School as SchoolIcon,
  Users,
  FileCheck2,
  Loader2,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MockTeacherDashboardClass } from "@/lib/mock-data";
import { DisplayAssessment } from "../hooks";
import { UpcomingAssessmentsCard } from "./UpcomingAssessmentsCard";
import { useTranslations } from "next-intl";

interface LiveSubmissionLike {
  assessmentId?: string;
  status: string;
  assessment?: { id: string };
}

interface TeacherDashboardContentProps {
  isDemoMode: boolean;
  teacherClasses: MockTeacherDashboardClass[];
  isLoading: boolean;
  isLoadingLive: boolean;
  liveFetchError: unknown;
  displayAssessments: DisplayAssessment[];
  submissions?: LiveSubmissionLike[];
}

export function TeacherDashboardContent({
  isDemoMode,
  teacherClasses,
  isLoading,
  isLoadingLive,
  liveFetchError,
  displayAssessments,
  submissions,
}: TeacherDashboardContentProps) {
  const t = useTranslations("Dashboard.teacherContent");

  const pendingByAssessment = React.useMemo(() => {
    const map = new Map<string, number>();
    (submissions ?? []).forEach((s) => {
      if (s.status === "SUBMITTED") {
        const aId = s.assessmentId ?? s.assessment?.id;
        if (aId) {
          map.set(aId, (map.get(aId) || 0) + 1);
        }
      }
    });
    return map;
  }, [submissions]);

  // Assessments that require teacher review (in demo mode or from live data)
  const pendingAssessments = isDemoMode
    ? [
        {
          id: "asm-2",
          title: "Science Homework 1 - 8A",
          subject: "Science",
          className: "Class 8A",
          pendingCount: 4,
          dueAt: "Due Today",
        },
        {
          id: "asm-1",
          title: "Mathematics Quiz 1 - 8A",
          subject: "Mathematics",
          className: "Class 8A",
          pendingCount: 2,
          dueAt: "Yesterday",
        },
      ]
    : displayAssessments
        .filter((a) => (pendingByAssessment.get(a.id) ?? 0) > 0)
        .map((a) => ({
          id: a.id,
          title: a.title,
          subject: a.subject,
          className: "Your Class",
          pendingCount: pendingByAssessment.get(a.id) ?? 0,
          dueAt: a.due || "Active",
        }));

  return (
    <div className="space-y-6">
      {/* Priority Section: Urgent Action Items / Needs Grading */}
      <Card className="border-warning/40 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-warning/15 text-warning">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("submissionsAwaitingGrading")}</CardTitle>
              <CardDescription className="text-xs">
                {t("submissionsAwaitingGradingDesc")}
              </CardDescription>
            </div>
          </div>
          <Link href="/submissions?status=SUBMITTED">
            <Button variant="ghost" size="sm" className="gap-1 text-warning hover:text-warning text-xs font-semibold">
              <span>{t("viewQueue")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-0">
          {pendingAssessments.length > 0 ? (
            pendingAssessments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border/60 hover:border-warning/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-foreground truncate">
                      {item.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {item.subject}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.className}</span>
                    <span>•</span>
                    <span className="text-warning font-medium">
                      {t("submissionsPending", { count: item.pendingCount })}
                    </span>
                  </div>
                </div>

                <Link href={`/submissions?status=SUBMITTED&assessmentTitle=${encodeURIComponent(item.title)}`}>
                  <Button
                    variant="role"
                    size="sm"
                    className="w-full sm:w-auto h-8 text-xs font-bold gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t("gradeSubmissions")}</span>
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-success/15 text-success flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-foreground text-sm">{t("allGradedSuccessTitle")}</span>
              <span className="text-muted-foreground max-w-sm">
                {t("allGradedSuccessDesc")}
              </span>
              <div className="flex gap-2 pt-2">
                <Link href="/submissions">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">
                    {t("viewAllSubmissions")}
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="role" size="sm" className="rounded-xl text-xs">
                    {t("openGradebook")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Classes — Tree: Class Name, Subject, Student Count, Assessment Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("myClasses")}</CardTitle>
            <CardDescription>{t("classesYouTeach")}</CardDescription>
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
                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs pt-2 sm:pt-0 border-t sm:border-t-0">
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

