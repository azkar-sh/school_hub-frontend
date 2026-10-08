import * as React from "react";
import Link from "next/link";
import { getMockStudentSubjectResults } from "@/lib/mock-data";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
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
  BookOpen,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
} from "lucide-react";
import {
  StudentSubjectResult,
  StudentAssessmentResult,
} from "../hooks";
import { useTranslations } from "next-intl";

interface StudentResultsViewProps {
  isDemoMode: boolean;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  studentSubjects: StudentSubjectResult[];
}

function scoreColor(pct: number | null) {
  if (pct === null) return "text-muted-foreground";
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

function scoreBadgeClass(pct: number | null) {
  if (pct === null) return "border-border/50 bg-muted/40 text-muted-foreground";
  if (pct >= 80)
    return "border-success/30 bg-success/15 text-success";
  if (pct >= 60)
    return "border-warning/30 bg-warning/15 text-warning";
  return "border-destructive/30 bg-destructive/15 text-destructive";
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export function StudentResultsView({
  isDemoMode,
  isLoading,
  isError,
  onRetry,
  studentSubjects,
}: StudentResultsViewProps) {
  const t = useTranslations("Results");
  const [selectedSubjectId, setSelectedSubjectId] =
    React.useState<string | null>(null);

  const mockSubjects = getMockStudentSubjectResults();

  const subjects: StudentSubjectResult[] = isDemoMode
    ? mockSubjects
    : studentSubjects;

  const selectedSubject = selectedSubjectId
    ? subjects.find((s) => s.subjectId === selectedSubjectId) ?? null
    : null;

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("myResults")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("myResultsSubtitle")}
        </p>
      </div>

      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingResults")}</span>
        </div>
      )}

      {/* Error state */}
      {!isDemoMode && !isLoading && isError && (
        <Card className="py-14 text-center text-sm border-destructive/20 bg-destructive/5 space-y-3">
          <div className="text-destructive font-medium">Failed to load results</div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="h-8 text-xs">
              Try Again
            </Button>
          )}
        </Card>
      )}

      {/* Subject Cards — Tree: Subject, Average Score */}
      {(!isLoading || isDemoMode) && !isError && !selectedSubject && (
        <>
          {subjects.length === 0 ? (
            <Card className="py-14 text-center text-sm text-muted-foreground">
              {t("noGradedAssessments")}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {subjects.map((subject) => (
                <button
                  key={subject.subjectId}
                  onClick={() => setSelectedSubjectId(subject.subjectId)}
                  className="text-left"
                >
                  <Card className="h-full hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg truncate">
                              {subject.subjectName}
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px]">
                              {subject.subjectCode}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs mt-0.5">
                            {subject.assessmentCount}{" "}
                            {subject.assessmentCount !== 1
                              ? t("gradedAssessments")
                              : t("gradedAssessment")}
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </CardHeader>
                    <CardContent className="pt-4 mt-1 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Award className="w-4 h-4 text-primary" />
                          <span>{t("averageScore")}</span>
                        </div>
                        <span
                          className={`text-2xl font-black ${scoreColor(subject.averageScore)}`}
                        >
                          {subject.averageScore}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Subject Detail — Tree: Assessment History, Grade */}
      {(!isLoading || isDemoMode) && selectedSubject && (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubjectId(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("allSubjects")}
            </Button>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="p-3 rounded-2xl bg-primary/15 text-primary shrink-0">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                      {selectedSubject.subjectName}
                    </h1>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedSubject.subjectCode}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedSubject.assessmentCount}{" "}
                    {selectedSubject.assessmentCount !== 1
                      ? t("gradedAssessments")
                      : t("gradedAssessment")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {t("average")}
                  </span>
                  <span
                    className={`text-3xl font-black ${scoreColor(selectedSubject.averageScore)}`}
                  >
                    {selectedSubject.averageScore}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-base">{t("assessmentHistory")}</CardTitle>
              <CardDescription className="text-xs">
                {t("assessmentHistoryDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/50 p-0">
              {selectedSubject.assessments.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  {t("noGradedForSubject")}
                </div>
              ) : (
                selectedSubject.assessments.map((a: StudentAssessmentResult) => {
                  const date = formatDate(a.submittedAt);
                  return (
                    <Link
                      key={a.id}
                      href={`/assessments/${a.id}`}
                      className="w-full flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="truncate font-semibold text-sm text-foreground">
                          {a.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase"
                          >
                            {a.type}
                          </Badge>
                          {date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {date}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-sm font-extrabold ${scoreBadgeClass(a.scorePercentage)}`}
                        >
                          {a.scorePercentage !== null
                            ? `${a.scorePercentage}%`
                            : t("pending")}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
