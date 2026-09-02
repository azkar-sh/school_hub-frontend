"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import {
  getMockTeacherResults,
  getMockTeacherResultsSummary,
  getMockStudentRecentResults,
  getMockParentRecentResults,
  MockTeacherResultRow,
  MockRecentResult,
} from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
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
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  CalendarDays,
  UserRound,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  questions?: unknown[];
  submissions?: Array<{ id: string; score?: number | string; student?: { name: string } }>;
}

export default function ResultsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // Filters (Teacher)
  const [assessmentFilter, setAssessmentFilter] = React.useState("ALL");
  const [classFilter, setClassFilter] = React.useState("ALL");

  // Selected result detail (Student)
  const [selectedResult, setSelectedResult] =
    React.useState<MockRecentResult | null>(null);

  // Live data
  const shouldFetchLive = !isDemoMode && (currentRole === "TEACHER" || currentRole === "STUDENT");
  const liveEndpoint =
    currentRole === "TEACHER" ? "/assessments/teacher" : currentRole === "STUDENT" ? "/assessments/student" : null;

  const { data: liveAssessmentsData, isLoading } = useFetchData<LiveAssessment[]>(
    () => apiClient.get<LiveAssessment[]>(liveEndpoint!).then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    shouldFetchLive && !!liveEndpoint,
  );
  const liveAssessments = liveAssessmentsData ?? [];

  // ===================== TEACHER VIEW =====================
  if (currentRole === "TEACHER") {
    const mockRows = getMockTeacherResults();

    // Build unique filter options
    const assessmentOptions = isDemoMode
      ? [...new Set(mockRows.map((r) => r.assessment))]
      : liveAssessments.map((a) => a.title);
    const classOptions = isDemoMode
      ? [...new Set(mockRows.map((r) => r.class))]
      : [];

    // Build display rows
    const displayRows: MockTeacherResultRow[] = isDemoMode
      ? mockRows
      : liveAssessments.flatMap((a) =>
          (a.submissions || []).map((s, idx) => ({
            id: s.id || `${a.id}-${idx}`,
            student: s.student?.name || "Unknown",
            assessment: a.title,
            subject: "—",
            class: "—",
            score: Number(s.score) || 0,
          })),
        );

    const filteredRows = displayRows.filter((r) => {
      const matchesAssessment =
        assessmentFilter === "ALL" || r.assessment === assessmentFilter;
      const matchesClass = classFilter === "ALL" || r.class === classFilter;
      return matchesAssessment && matchesClass;
    });

    const summary = getMockTeacherResultsSummary(filteredRows);

    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Assessment Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View student scores and performance across your classes
          </p>
        </div>

        {/* Summary — Tree: Average, Highest, Lowest */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                Average
              </CardTitle>
              <Minus className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {summary.average}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                Highest
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-500">
                {summary.highest}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                Lowest
              </CardTitle>
              <TrendingDown className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-amber-500">
                {summary.lowest}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters — Tree: Assessment Filter, Class Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Assessment
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                value={assessmentFilter}
                onChange={(e) => setAssessmentFilter(e.target.value)}
              >
                <option value="ALL">All Assessments</option>
                {assessmentOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Class
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="ALL">All Classes</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Loading state */}
        {!isDemoMode && isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading results…</span>
          </div>
        )}

        {/* Student Results — Tree: Student, Score */}
        {(!isLoading || isDemoMode) && (
          <Card>
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-base">
                {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
              </CardTitle>
              <CardDescription className="text-xs">
                Student scores across filtered assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredRows.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                      <tr>
                        <th className="p-3 font-semibold rounded-l-xl">
                          Student
                        </th>
                        <th className="p-3 font-semibold">Assessment</th>
                        <th className="p-3 font-semibold">Subject</th>
                        <th className="p-3 font-semibold">Class</th>
                        <th className="p-3 font-semibold text-right rounded-r-xl">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredRows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3.5 font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="w-4 h-4 text-primary shrink-0" />
                              <span>{row.student}</span>
                            </div>
                          </td>
                          <td className="p-3.5">{row.assessment}</td>
                          <td className="p-3.5 text-muted-foreground">
                            {row.subject}
                          </td>
                          <td className="p-3.5">
                            <Badge variant="outline" className="text-xs">
                              {row.class}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            <span
                              className={`font-extrabold text-base ${
                                row.score >= 80
                                  ? "text-emerald-600"
                                  : row.score >= 60
                                  ? "text-amber-500"
                                  : "text-destructive"
                              }`}
                            >
                              {row.score}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ===================== STUDENT VIEW =====================
  if (currentRole === "STUDENT") {
    const mockResults = getMockStudentRecentResults();

    const displayResults: MockRecentResult[] = isDemoMode
      ? mockResults
      : liveAssessments
          .filter((a) => a.submissions && a.submissions.length > 0)
          .map((a, idx) => ({
            id: a.id,
            assessment: a.title,
            subject: "—",
            score: Number(a.submissions?.[0]?.score) || 0,
            date: a.dueAt
              ? new Date(a.dueAt).toLocaleDateString()
              : `Result ${idx + 1}`,
          }));

    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your graded assessments and scores
          </p>
        </div>

        {/* Loading state */}
        {!isDemoMode && isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading results…</span>
          </div>
        )}

        {(!isLoading || isDemoMode) && (
          <>
            {/* Result List — Tree: Assessment, Subject, Score, Date */}
            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-base">
                  {displayResults.length} result
                  {displayResults.length !== 1 ? "s" : ""}
                </CardTitle>
                <CardDescription className="text-xs">
                  Click a result to review your answers
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/50 p-0">
                {displayResults.length === 0 ? (
                  <div className="py-14 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                ) : (
                  displayResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="truncate font-semibold text-sm text-foreground">
                          {result.assessment}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {result.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {result.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant={
                            result.score >= 80 ? "secondary" : "outline"
                          }
                          className={`text-sm font-extrabold ${
                            result.score >= 80
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "text-amber-500 border-amber-500/30"
                          }`}
                        >
                          {result.score}%
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Result Detail — Tree: Score, Question Review */}
            {selectedResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <Card className="w-full max-w-lg shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Result Detail
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {selectedResult.assessment}
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="text-muted-foreground text-xs"
                    >
                      Close
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Your Score
                      </p>
                      <p
                        className={`text-4xl font-black mt-1 ${
                          selectedResult.score >= 80
                            ? "text-emerald-600"
                            : "text-amber-500"
                        }`}
                      >
                        {selectedResult.score}%
                      </p>
                    </div>

                    {/* Question Review */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Question Review
                      </p>
                      <div className="space-y-2">
                        {[1, 2, 3].map((qNum) => (
                          <div
                            key={qNum}
                            className="p-3 rounded-xl bg-card border border-border/60 text-xs space-y-1"
                          >
                            <p className="font-semibold text-foreground">
                              Question {qNum}
                            </p>
                            <p className="text-muted-foreground">
                              Correct answer selected.
                            </p>
                            <Badge
                              variant="secondary"
                              className="bg-emerald-500/15 text-emerald-600 text-[10px]"
                            >
                              Full marks
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ===================== PARENT VIEW =====================
  // Tree: optional / can be merged into Child Detail
  const parentResults = getMockParentRecentResults();

  const displayParentResults: MockRecentResult[] = isDemoMode
    ? parentResults
    : [];

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Results
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your child&apos;s assessment results and scores
        </p>
      </div>

      {/* Info Banner: results are also available in child detail */}
      <Card className="border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            You can also view results per child from the Children page.
          </p>
          <Link href="/children">
            <Button variant="outline" size="sm" className="text-xs">
              View Children
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Result List — Tree: Assessment, Subject, Score, Date */}
      <Card>
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-base">
            {displayParentResults.length} result
            {displayParentResults.length !== 1 ? "s" : ""}
          </CardTitle>
          <CardDescription className="text-xs">
            Your child&apos;s latest graded assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 p-0">
          {displayParentResults.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              No results found. {isDemoMode ? "" : "Link a child account to see their results."}
            </div>
          ) : (
            displayParentResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="truncate font-semibold text-sm text-foreground">
                    {result.assessment}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {result.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {result.date}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={result.score >= 80 ? "secondary" : "outline"}
                  className={`text-sm font-extrabold shrink-0 ${
                    result.score >= 80
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "text-amber-500 border-amber-500/30"
                  }`}
                >
                  {result.score}%
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
