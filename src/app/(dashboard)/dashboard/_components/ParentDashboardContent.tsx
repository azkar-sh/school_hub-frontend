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
import {
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { MockParentChild, MockRecentResult } from "@/lib/mock-data";
import { RecentResultsCard } from "./RecentResultsCard";
import { useTranslations } from "next-intl";

interface ParentDashboardContentProps {
  isDemoMode: boolean;
  parentChildren: MockParentChild[];
  parentRecentResults: MockRecentResult[];
  isLoading: boolean;
  hasError?: boolean;
}

export function ParentDashboardContent({
  isDemoMode,
  parentChildren,
  parentRecentResults,
  isLoading,
  hasError,
}: ParentDashboardContentProps) {
  const t = useTranslations("Dashboard.parentContent");
  return (
    <div className="space-y-6">
      {/* Children — Tree: Child Name, Class, Latest Result */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("children")}</CardTitle>
            <CardDescription>{t("monitorLinked")}</CardDescription>
          </div>
          <Link href="/children">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              <span>{t("viewAll")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && !isDemoMode ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t("loadingChildren")}</span>
            </div>
          ) : hasError && !isDemoMode ? (
            <div className="py-6 text-center text-xs text-destructive">
              Failed to load children data
            </div>
          ) : parentChildren.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {t("noChildren")}
            </div>
          ) : (
            parentChildren.map((child) => (
              <Link key={child.id} href={`/children/${child.id}`}>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {child.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t("classPrefix", { name: child.className })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {child.latestResult}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <RecentResultsCard
        description={t("recentResultsDesc")}
        results={parentRecentResults}
        isLoading={!isDemoMode && isLoading}
        hasError={hasError}
      />
    </div>
  );
}
