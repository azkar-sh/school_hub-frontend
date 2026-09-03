import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, PlayCircle } from "lucide-react";
import { DisplayAssessment } from "../hooks";

interface UpcomingAssessmentsCardProps {
  title: string;
  description: string;
  isLoadingLive: boolean;
  liveFetchError: unknown;
  isDemoMode: boolean;
  assessments: DisplayAssessment[];
  /** Teacher sees "Manage" + points, student sees "Start" + play icon */
  variant: "teacher" | "student";
}

export function UpcomingAssessmentsCard({
  title,
  description,
  isLoadingLive,
  liveFetchError,
  isDemoMode,
  assessments,
  variant,
}: UpcomingAssessmentsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Link href="/assessments">
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingLive ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading assessments…</span>
          </div>
        ) : liveFetchError && !isDemoMode ? (
          <div className="py-6 text-center text-xs text-destructive">
            Failed to load assessments. Please try refreshing.
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No assessments found.
          </div>
        ) : (
          assessments.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/70 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.type}
                  </Badge>
                  {item.subject && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.subject}
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-base text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {item.questionsCount > 0 &&
                    `${item.questionsCount} Questions • `}
                  {variant === "teacher" &&
                    item.points > 0 &&
                    `${item.points} Points • `}
                  <span className="text-amber-500 font-medium">
                    {variant === "teacher" ? item.due : `Due: ${item.due}`}
                  </span>
                </p>
              </div>
              <Link href={`/assessments/${item.id}`}>
                <Button variant="role" size="sm">
                  {variant === "student" && (
                    <PlayCircle className="w-4 h-4 mr-1.5" />
                  )}
                  {variant === "teacher" ? "Manage" : "Start"}
                </Button>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
