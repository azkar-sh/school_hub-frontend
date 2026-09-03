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
import { ArrowRight, GraduationCap } from "lucide-react";
import { MockParentChild, MockRecentResult } from "@/lib/mock-data";
import { RecentResultsCard } from "./RecentResultsCard";

interface ParentDashboardContentProps {
  isDemoMode: boolean;
  parentChildren: MockParentChild[];
  parentRecentResults: MockRecentResult[];
}

export function ParentDashboardContent({
  isDemoMode,
  parentChildren,
  parentRecentResults,
}: ParentDashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Children — Tree: Child Name, Class, Latest Result */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Children</CardTitle>
            <CardDescription>Monitor your linked students</CardDescription>
          </div>
          <Link href="/children">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {isDemoMode ? (
            parentChildren.map((child) => (
              <Link key={child.id} href={`/children/${child.id}`}>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {child.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Class {child.className}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {child.latestResult}
                  </Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No children linked yet.
            </div>
          )}
        </CardContent>
      </Card>

      <RecentResultsCard
        description="Your child's latest graded assessments"
        results={isDemoMode ? parentRecentResults : []}
      />
    </div>
  );
}
