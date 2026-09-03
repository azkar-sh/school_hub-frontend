import * as React from "react";
import { getMockStudentRecentResults, MockRecentResult } from "@/lib/mock-data";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarDays, ArrowRight, Loader2 } from "lucide-react";
import { LiveAssessment } from "../hooks";

interface StudentResultsViewProps {
  isDemoMode: boolean;
  isLoading: boolean;
  liveAssessments: LiveAssessment[];
}

export function StudentResultsView({
  isDemoMode,
  isLoading,
  liveAssessments,
}: StudentResultsViewProps) {
  const [selectedResult, setSelectedResult] =
    React.useState<MockRecentResult | null>(null);

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

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          My Results
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your graded assessments and scores
        </p>
      </div>

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
                        variant={result.score >= 80 ? "secondary" : "outline"}
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
                    <CardTitle className="text-lg">Result Detail</CardTitle>
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
