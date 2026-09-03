import * as React from "react";
import {
  getMockTeacherResults,
  getMockTeacherResultsSummary,
  MockTeacherResultRow,
} from "@/lib/mock-data";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
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
  UserRound,
  Loader2,
} from "lucide-react";
import { LiveAssessment } from "../hooks";

interface TeacherResultsViewProps {
  isDemoMode: boolean;
  isLoading: boolean;
  liveAssessments: LiveAssessment[];
}

export function TeacherResultsView({
  isDemoMode,
  isLoading,
  liveAssessments,
}: TeacherResultsViewProps) {
  const [assessmentFilter, setAssessmentFilter] = React.useState("ALL");
  const [classFilter, setClassFilter] = React.useState("ALL");

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
