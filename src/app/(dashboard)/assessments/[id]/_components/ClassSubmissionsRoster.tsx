"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  ArrowRight,
  Sparkles,
  Eye,
  BarChart3,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { classesApi, submissionsApi } from "@/lib/api-client";
import { Assessment, Submission } from "@/types";
import { useTranslations } from "next-intl";

interface ClassSubmissionsRosterProps {
  assessment: Assessment | null;
  isDemoMode: boolean;
}

interface RosterStudent {
  id: string;
  name: string;
  email: string;
  submissionId?: string;
  status: "GRADED" | "SUBMITTED" | "NOT_STARTED";
  score?: number | null;
  submittedAt?: string | null;
}

const DEMO_ROSTER: RosterStudent[] = [
  { id: "s1", name: "Budi Santoso", email: "student1.garuda@learnhub.com", submissionId: "sub-1", status: "GRADED", score: 85, submittedAt: "2 hours ago" },
  { id: "s2", name: "Siti Rahma", email: "student2.garuda@learnhub.com", submissionId: "sub-2", status: "GRADED", score: 92, submittedAt: "3 hours ago" },
  { id: "s3", name: "Ahmad Dani", email: "student3.garuda@learnhub.com", submissionId: "sub-3", status: "SUBMITTED", score: null, submittedAt: "30 mins ago" },
  { id: "s4", name: "Dewi Lestari", email: "student4.garuda@learnhub.com", submissionId: "sub-4", status: "GRADED", score: 78, submittedAt: "1 day ago" },
  { id: "s5", name: "Rizky Pratama", email: "student5.garuda@learnhub.com", status: "NOT_STARTED", score: null, submittedAt: null },
  { id: "s6", name: "Putri Ayu", email: "student6.garuda@learnhub.com", status: "NOT_STARTED", score: null, submittedAt: null },
];

export function ClassSubmissionsRoster({
  assessment,
  isDemoMode,
}: ClassSubmissionsRosterProps) {
  const t = useTranslations("Assessments");
  const [roster, setRoster] = React.useState<RosterStudent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "GRADED" | "SUBMITTED" | "NOT_STARTED">("ALL");

  const classId = assessment?.teachingAssignment?.class?.id || assessment?.teachingAssignment?.classId;
  const className = assessment?.teachingAssignment?.class?.name || "Class 8A";
  const subjectName = assessment?.teachingAssignment?.subject?.name || "Mathematics";

  React.useEffect(() => {
    if (isDemoMode) {
      setRoster(DEMO_ROSTER);
      setIsLoading(false);
      return;
    }

    if (!assessment?.id) return;

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      // 1. Fetch class enrollments
      classId ? classesApi.findOne(classId).catch(() => null) : Promise.resolve(null),
      // 2. Fetch submissions for this teacher's assessments
      submissionsApi.findAll({ limit: 1000 }).catch(() => null),
    ])
      .then(([classRes, subsRes]) => {
        if (cancelled) return;

        // Class enrollments
        const classData = classRes?.data as any;
        const enrollments: any[] = classData?.enrollments || [];

        // Filter submissions for this specific assessment
        const rawSubs = subsRes?.data;
        const allSubs: Submission[] = Array.isArray(rawSubs)
          ? rawSubs
          : (rawSubs as any)?.submissions || [];
        const assessmentSubs = allSubs.filter((s) => s.assessmentId === assessment.id);

        const subsByStudentId = new Map<string, Submission>();
        assessmentSubs.forEach((s) => {
          if (s.studentId) subsByStudentId.set(s.studentId, s);
        });

        if (enrollments.length > 0) {
          const list: RosterStudent[] = enrollments.map((en) => {
            const student = en.student;
            const sub = subsByStudentId.get(student?.id);
            return {
              id: student?.id || en.id,
              name: student?.name || "Student",
              email: student?.email || "",
              submissionId: sub?.id,
              status: sub ? (sub.status as any) : "NOT_STARTED",
              score: sub ? (sub.scorePercentage ?? (sub.score ? Number(sub.score) : null)) : null,
              submittedAt: sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : null,
            };
          });
          setRoster(list);
        } else if (assessmentSubs.length > 0) {
          // If no enrollment relation, list from submissions
          const list: RosterStudent[] = assessmentSubs.map((sub) => ({
            id: sub.student?.id || sub.studentId,
            name: sub.student?.name || "Student",
            email: sub.student?.email || "",
            submissionId: sub.id,
            status: sub.status as any,
            score: sub.scorePercentage ?? (sub.score ? Number(sub.score) : null),
            submittedAt: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : null,
          }));
          setRoster(list);
        } else {
          setRoster([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isDemoMode, assessment?.id, classId]);

  // Derived metrics
  const totalCount = roster.length;
  const gradedCount = roster.filter((r) => r.status === "GRADED").length;
  const submittedCount = roster.filter((r) => r.status === "SUBMITTED").length;
  const notStartedCount = roster.filter((r) => r.status === "NOT_STARTED").length;

  const scoredStudents = roster.filter((r) => r.score !== null && r.score !== undefined);
  const classAvg =
    scoredStudents.length > 0
      ? Math.round(
          scoredStudents.reduce((acc, s) => acc + Number(s.score), 0) /
            scoredStudents.length
        )
      : null;

  // Filtered roster
  const filteredRoster = roster.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm font-medium">{t("loadingRoster")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase">
            <span>{t("totalStudents")}</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-foreground">
            {totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {className} • {subjectName}
          </p>
        </Card>

        {/* Graded */}
        <Card className="p-4 rounded-2xl bg-emerald-500/5 border-emerald-500/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
            <span>{t("completedGrading")}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-emerald-700 dark:text-emerald-300">
            {gradedCount}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">
            {totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0}{t("percentComplete")}
          </p>
        </Card>

        {/* Pending Review */}
        <Card className="p-4 rounded-2xl bg-amber-500/5 border-amber-500/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase">
            <span>{t("awaitingReview")}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-amber-700 dark:text-amber-300">
            {submittedCount}
          </div>
          <p className="text-[11px] text-amber-600/80 mt-0.5">
            {t("needsManualReview")}
          </p>
        </Card>

        {/* Class Average */}
        <Card className="p-4 rounded-2xl bg-card border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase">
            <span>{t("averageGrade")}</span>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-foreground">
            {classAvg !== null ? `${classAvg}%` : "-"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {notStartedCount} {t("studentsNotStarted")}
          </p>
        </Card>
      </div>

      {/* Roster Controls: Search & Status Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchStudentsPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-border/80 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { key: "ALL", label: t("filterAll") },
              { key: "GRADED", label: t("filterGraded") },
              { key: "SUBMITTED", label: t("filterWaiting") },
              { key: "NOT_STARTED", label: t("filterNotStarted") },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student List Table */}
      <Card className="border-border/70 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-semibold border-b border-border/60">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">{t("colStudentName")}</th>
                <th className="py-3 px-4">{t("colSubmissionStatus")}</th>
                <th className="py-3 px-4">{t("colSubmittedAt")}</th>
                <th className="py-3 px-4 text-center">{t("colGrade")}</th>
                <th className="py-3 px-4 text-right">{t("colAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRoster.length > 0 ? (
                filteredRoster.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-sm leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {item.status === "GRADED" && (
                        <Badge variant="success" className="gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("completedGrading")}</span>
                        </Badge>
                      )}
                      {item.status === "SUBMITTED" && (
                        <Badge variant="warning" className="gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t("awaitingReview")}</span>
                        </Badge>
                      )}
                      {item.status === "NOT_STARTED" && (
                        <Badge variant="secondary" className="gap-1 font-normal opacity-70">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{t("notStartedYet")}</span>
                        </Badge>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {item.submittedAt || "-"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.score !== null && item.score !== undefined ? (
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-black",
                            item.score >= 75
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-destructive/15 text-destructive"
                          )}
                        >
                          {item.score}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {item.submissionId ? (
                        <Link href={`/submissions/${item.submissionId}`}>
                          <Button
                            variant={item.status === "SUBMITTED" ? "role" : "outline"}
                            size="sm"
                            className="rounded-xl text-xs gap-1.5 h-8 font-semibold"
                          >
                            {item.status === "SUBMITTED" ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{t("gradeAction")}</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{t("reviewAction")}</span>
                              </>
                            )}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="rounded-xl text-xs h-8 text-muted-foreground"
                        >
                          {t("noneYet")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    {t("noStudentsMatch")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
