"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getMockChildDetail,
  getMockChildAssessmentResults,
} from "@/lib/mock-data";
import { useParentChildren } from "@/lib/use-parent-children";
import { StudentSubjectResult } from "@/lib/result-grouping";
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
  ArrowLeft,
  GraduationCap,
  Award,
  FileCheck2,
  BookOpen,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ResultRow {
  id: string;
  title: string;
  type?: string;
  subjectName: string;
  scorePercentage: number | null;
  submittedAt?: string;
  dateLabel?: string;
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

function scoreBadgeClass(pct: number | null) {
  if (pct === null) return "border-border/50 bg-muted/40 text-muted-foreground";
  if (pct >= 80)
    return "border-success/30 bg-success/15 text-success";
  if (pct >= 60)
    return "border-warning/30 bg-warning/15 text-warning";
  return "border-destructive/30 bg-destructive/15 text-destructive";
}

function flattenSubjects(subjects: StudentSubjectResult[]): ResultRow[] {
  return subjects.flatMap((subj) =>
    subj.assessments.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type,
      subjectName: subj.subjectName,
      scorePercentage: a.scorePercentage,
      submittedAt: a.submittedAt,
    })),
  );
}

interface ChildDetail {
  id: string;
  name: string;
  className: string;
  grade: number | null;
  assessmentCount: number;
  average: number;
  results: ResultRow[];
}

export default function ChildDetailPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { isDemoMode, isLoading, isError, refetch, children } =
    useParentChildren();
  const t = useTranslations("Children");

  const child: ChildDetail | null = React.useMemo(() => {
    if (isDemoMode) {
      const detail = getMockChildDetail(studentId);
      return {
        id: detail.id,
        name: detail.name,
        className: detail.className,
        grade: detail.grade,
        assessmentCount: detail.assessmentCount,
        average: detail.average,
        results: getMockChildAssessmentResults(studentId).map((r) => ({
          id: r.id,
          title: r.assessment,
          subjectName: r.subject,
          scorePercentage: r.score,
          dateLabel: r.date,
        })),
      };
    }
    const found = children.find((c) => c.id === studentId);
    if (!found) return null;
    return {
      id: found.id,
      name: found.name,
      className: found.className,
      grade: found.grade,
      assessmentCount: found.assessmentCount,
      average: found.average,
      results: flattenSubjects(found.subjects),
    };
  }, [isDemoMode, children, studentId]);

  const avgScore = child?.average ?? 0;

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Back Link */}
      <Link
        href="/children"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToChildren")}
      </Link>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingChildDetails")}</span>
        </div>
      )}

      {/* Error state */}
      {!isDemoMode && !isLoading && isError && (
        <Card className="py-14 text-center text-sm border-destructive/20 bg-destructive/5 space-y-3">
          <div className="text-destructive font-medium">Failed to load child details</div>
          <Button variant="outline" size="sm" onClick={refetch} className="h-8 text-xs">
            Try Again
          </Button>
        </Card>
      )}

      {/* Not found (live mode, finished loading, no matching child) */}
      {!isDemoMode && !isLoading && !isError && !child && (
        <Card className="py-14 text-center text-sm text-muted-foreground">
          {t("childNotFound")}
        </Card>
      )}

      {(!isLoading || isDemoMode) && !isError && child && (
        <>
          {/* Child Header — Tree: Name, Class */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">
                      {child.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t("classLabel")} {child.className}
                      {child.grade !== null ? ` • ${t("gradeLabel")} ${child.grade}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{t("assessmentsLabel")}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">
                      {child.assessmentCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Award className="w-3.5 h-3.5" />
                      <span>{t("averageLabel")}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-primary">
                      {avgScore}%
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Assessment Results — Tree: Assessment, Subject, Score, Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-primary" />
                {t("assessmentResults")}
              </CardTitle>
              <CardDescription>
                {t("assessmentResultsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {child.results.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  {t("noResultsFound")}
                </div>
              ) : (
                child.results.map((result) => {
                  const date =
                    result.dateLabel ?? formatDate(result.submittedAt);
                  return (
                    <div
                      key={result.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {result.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {result.subjectName}
                          </span>
                          {result.type && (
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase"
                            >
                              {result.type}
                            </Badge>
                          )}
                          {date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {date}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          result.scorePercentage !== null &&
                          result.scorePercentage >= 80
                            ? "secondary"
                            : "outline"
                        }
                        className={`text-sm font-extrabold shrink-0 ${scoreBadgeClass(result.scorePercentage)}`}
                      >
                        {result.scorePercentage !== null
                          ? `${result.scorePercentage}%`
                          : t("pending")}
                      </Badge>
                    </div>
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
