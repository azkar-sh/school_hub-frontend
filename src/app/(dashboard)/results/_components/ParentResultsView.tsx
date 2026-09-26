import * as React from "react";
import Link from "next/link";
import {
  getMockParentChildrenDetail,
  getMockChildAssessmentResults,
} from "@/lib/mock-data";
import { ParentChildSummary } from "@/lib/use-parent-children";
import { StudentSubjectResult } from "../hooks";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CalendarDays,
  ArrowRight,
  GraduationCap,
  Loader2,
  Award,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ParentResultsViewProps {
  isDemoMode: boolean;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  parentChildrenResults: ParentChildSummary[];
}

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

/** Flatten a child's subject groupings into a single recent-results list. */
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

interface ChildBlock {
  id: string;
  name: string;
  className: string;
  assessmentCount: number;
  average: number;
  results: ResultRow[];
}

export function ParentResultsView({
  isDemoMode,
  isLoading,
  isError,
  onRetry,
  parentChildrenResults,
}: ParentResultsViewProps) {
  const t = useTranslations("Results");
  // Build a uniform per-child list for both demo + live modes.
  const children: ChildBlock[] = React.useMemo(() => {
    if (isDemoMode) {
      return getMockParentChildrenDetail().map((c) => ({
        id: c.id,
        name: c.name,
        className: c.className,
        assessmentCount: c.assessmentCount,
        average: c.average,
        results: getMockChildAssessmentResults(c.id).map((r) => ({
          id: r.id,
          title: r.assessment,
          subjectName: r.subject,
          scorePercentage: r.score,
          dateLabel: r.date,
        })),
      }));
    }
    return parentChildrenResults.map((c) => ({
      id: c.id,
      name: c.name,
      className: c.className,
      assessmentCount: c.assessmentCount,
      average: c.average,
      results: flattenSubjects(c.subjects),
    }));
  }, [isDemoMode, parentChildrenResults]);

  const totalResults = children.reduce((n, c) => n + c.results.length, 0);

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("parentTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("parentSubtitle")}
        </p>
      </div>

      {/* Info Banner: results are also available in child detail */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t("parentNote")}
          </p>
          <Link href="/children">
            <Button variant="outline" size="sm" className="text-xs">
              {t("viewChildren")}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Loading state */}
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

      {(!isLoading || isDemoMode) && !isError && (
        <>
          {children.length === 0 ? (
            <Card className="py-14 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </Card>
          ) : (
            <div className="space-y-6">
              {children.map((child) => (
                <Card key={child.id} className="border-border/60">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate">
                          {child.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {t("class")} {child.className} • {child.assessmentCount}{" "}
                          {child.assessmentCount !== 1
                            ? t("gradedAssessments")
                            : t("gradedAssessment")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        {t("average")}
                      </span>
                      <span className="text-2xl font-black text-primary">
                        {child.average}%
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="divide-y divide-border/50 p-0">
                    {child.results.length === 0 ? (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        {t("noGradedForChild")}
                      </div>
                    ) : (
                      child.results.map((result) => {
                        const date = result.dateLabel ?? formatDate(result.submittedAt);
                        return (
                          <Link
                            key={result.id}
                            href={`/children/${child.id}`}
                            className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40"
                          >
                            <div className="space-y-1 min-w-0">
                              <h4 className="truncate font-semibold text-sm text-foreground">
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
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Award className="w-3.5 h-3.5 text-primary" />
                                <span>{child.average}%</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-sm font-extrabold ${scoreBadgeClass(result.scorePercentage)}`}
                              >
                                {result.scorePercentage !== null
                                  ? `${result.scorePercentage}%`
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
              ))}

              {/* Summary footer */}
              <p className="text-xs text-muted-foreground text-center">
                {t("parentSummaryFooter", {
                  total: totalResults,
                  children: children.length,
                })}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
