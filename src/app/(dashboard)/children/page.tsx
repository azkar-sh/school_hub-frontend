"use client";

import * as React from "react";
import Link from "next/link";
import {
  getMockParentChildrenDetail,
} from "@/lib/mock-data";
import { useParentChildren } from "@/lib/use-parent-children";
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
  GraduationCap,
  FileCheck2,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ChildCard {
  id: string;
  name: string;
  className: string;
  grade: number | null;
  assessmentCount: number;
  average: number;
}

export default function ChildrenPage() {
  const { isDemoMode, isLoading, isError, refetch, children } =
    useParentChildren();
  const t = useTranslations("Children");

  const mockChildren = getMockParentChildrenDetail();

  const displayChildren: ChildCard[] = isDemoMode
    ? mockChildren.map((c) => ({
        id: c.id,
        name: c.name,
        className: c.className,
        grade: 8,
        assessmentCount: c.assessmentCount,
        average: c.average,
      }))
    : children.map((c) => ({
        id: c.id,
        name: c.name,
        className: c.className,
        grade: c.grade,
        assessmentCount: c.assessmentCount,
        average: c.average,
      }));

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingChildren")}</span>
        </div>
      )}

      {/* Error state */}
      {!isDemoMode && !isLoading && isError && (
        <Card className="py-12 text-center text-sm border-destructive/20 bg-destructive/5 space-y-3">
          <div className="text-destructive font-medium">Failed to load children data</div>
          <Button variant="outline" size="sm" onClick={refetch} className="h-8 text-xs">
            Try Again
          </Button>
        </Card>
      )}

      {/* Children List */}
      {(!isLoading || isDemoMode) && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayChildren.length === 0 ? (
            <Card className="col-span-2 py-14 text-center text-sm text-muted-foreground">
              {t("noChildrenLinked")}
            </Card>
          ) : (
            displayChildren.map((child) => (
              <Card
                key={child.id}
                className="hover:border-primary/50 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {child.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {t("classLabel")} {child.className}
                        </CardDescription>
                      </div>
                    </div>
                    {child.grade !== null && (
                      <Badge variant="role" className="text-xs">
                        {t("gradeLabel")} {child.grade}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2 border-t border-border/40 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck2 className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("assessmentsLabel")}
                        </p>
                        <p className="font-bold text-foreground">
                          {child.assessmentCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("averageLabel")}
                        </p>
                        <p className="font-bold text-primary">
                          {child.average}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/children/${child.id}`}>
                    <Button variant="role" size="sm" className="w-full">
                      {t("viewResults")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
