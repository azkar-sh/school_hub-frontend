"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  getMockChildDetail,
  getMockChildAssessmentResults,
  MockChildDetail,
  MockRecentResult,
} from "@/lib/mock-data";
import { usersApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
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
  ArrowLeft,
  GraduationCap,
  Award,
  FileCheck2,
  BookOpen,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function ChildDetailPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { isDemoMode } = useAuthStore();

  const { data: liveStudentData, isLoading } = useFetchData<{ name: string; email: string }>(
    () => usersApi.findOne(studentId).then((res) => ({ name: res.data.name, email: res.data.email })),
    [studentId],
    !isDemoMode && !!studentId,
  );
  const liveStudent = liveStudentData ?? null;

  const mockDetail = getMockChildDetail(studentId);
  const mockResults = getMockChildAssessmentResults(studentId);

  const childDetail: MockChildDetail = isDemoMode
    ? mockDetail
    : {
        ...mockDetail,
        name: liveStudent?.name || mockDetail.name,
      };

  const displayResults: MockRecentResult[] = isDemoMode
    ? mockResults
    : [];

  const avgScore =
    displayResults.length > 0
      ? Math.round(
          displayResults.reduce((acc, r) => acc + r.score, 0) /
            displayResults.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Back Link */}
      <Link
        href="/children"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Children
      </Link>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading child details…</span>
        </div>
      )}

      {(!isLoading || isDemoMode) && (
        <>
          {/* Child Header — Tree: Name, Class */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">
                      {childDetail.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Class {childDetail.className} • Grade {childDetail.grade}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Assessments</span>
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">
                      {childDetail.assessmentCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Award className="w-3.5 h-3.5" />
                      <span>Average</span>
                    </div>
                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                      {avgScore}%
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Assessment Results — Tree: Assessment, Subject, Score, Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-primary" />
                Assessment Results
              </CardTitle>
              <CardDescription>
                All completed and graded assessments for this child
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayResults.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  No assessment results found.
                </div>
              ) : (
                displayResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">
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
        </>
      )}
    </div>
  );
}
