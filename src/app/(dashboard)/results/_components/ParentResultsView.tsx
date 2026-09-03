import Link from "next/link";
import { getMockParentRecentResults, MockRecentResult } from "@/lib/mock-data";
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
import { BookOpen, CalendarDays, ArrowRight } from "lucide-react";

interface ParentResultsViewProps {
  isDemoMode: boolean;
}

export function ParentResultsView({ isDemoMode }: ParentResultsViewProps) {
  const parentResults = getMockParentRecentResults();

  const displayParentResults: MockRecentResult[] = isDemoMode
    ? parentResults
    : [];

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

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
              No results found.{" "}
              {isDemoMode ? "" : "Link a child account to see their results."}
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
