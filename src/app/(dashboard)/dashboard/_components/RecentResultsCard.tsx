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
import { ArrowRight } from "lucide-react";

interface RecentResultItem {
  id: string;
  assessment: string;
  subject: string;
  score: number;
  date: string;
}

interface RecentResultsCardProps {
  description: string;
  results: RecentResultItem[];
}

export function RecentResultsCard({
  description,
  results,
}: RecentResultsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Link href="/results">
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.length > 0 ? (
          results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  {result.assessment}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {result.subject} • {result.date}
                </p>
              </div>
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
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No results yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
