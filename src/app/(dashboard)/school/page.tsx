"use client";

import * as React from "react";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { useAuthStore } from "@/stores/use-auth-store";
import { useFetchData } from "@/lib/use-fetch-data";
import { schoolsApi } from "@/lib/api-client";
import { School } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  School as SchoolIcon,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SchoolWithDetails extends School {
  _count?: {
    members?: number;
    classes?: number;
  };
}

export default function SchoolPage() {
  const t = useTranslations("School");
  const { user, isDemoMode } = useAuthStore();
  const { schools, selectedSchoolId, setSelectedSchoolId } = useSchoolSelection();
  const [copiedId, setCopiedId] = React.useState(false);

  // Fetch School Details
  const {
    data: schoolData,
    isLoading,
  } = useFetchData(
    () =>
      schoolsApi
        .findOne(selectedSchoolId)
        .then((res) => (res.data ? (res.data as SchoolWithDetails) : null)),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );

  const school = schoolData ?? (schools.find((s) => s.id === selectedSchoolId) as SchoolWithDetails | undefined);

  const copySchoolId = () => {
    if (!school?.id) return;
    navigator.clipboard.writeText(school.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const memberCount = school?._count?.members ?? 0;
  const classCount = school?._count?.classes ?? 0;
  const subjectCount = school?.subjects?.length ?? 0;
  const activeYear = school?.academicYears?.find((ay) => ay.isActive)?.name ?? "2026/2027";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        {schools.length > 1 && (
          <div className="flex items-center gap-3">
            <select
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading school profile...</span>
        </div>
      ) : (
        <>
          {user?.role === "SCHOOL_ADMIN" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-foreground">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>
                  <strong>Executive Access:</strong> Full campus registration, parent-student guardianship relations, and governance operations are managed in the School Admin Hub.
                </span>
              </div>
              <Link href="/admin">
                <Button size="sm" variant="role" className="text-xs shrink-0 rounded-xl h-8">
                  <span>Open School Admin Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Main Institution Hero Card */}
          <Card className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.03] overflow-hidden shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-inner">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        {school?.name || "School Institution"}
                      </h2>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 gap-1 font-semibold text-xs py-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Institution
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded-lg border border-border/40 select-all">
                        {school?.id}
                      </span>
                      <button
                        onClick={copySchoolId}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/10"
                        title="Copy School ID"
                      >
                        {copiedId ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/classes">
                    <Button variant="outline" className="rounded-xl text-xs gap-1.5 font-semibold">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Classes Hub</span>
                    </Button>
                  </Link>
                  <Link href="/members">
                    <Button variant="role" className="rounded-xl text-xs gap-1.5 font-semibold shadow-md">
                      <Users className="w-4 h-4" />
                      <span>Manage Members</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    School Members
                  </p>
                  <h3 className="text-2xl font-black mt-1 text-foreground">
                    {memberCount}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Teachers, Admins & Students
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Class Sections
                  </p>
                  <h3 className="text-2xl font-black mt-1 text-foreground">
                    {classCount}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Active cohorts & homerooms
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Registered Subjects
                  </p>
                  <h3 className="text-2xl font-black mt-1 text-foreground">
                    {subjectCount}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Curricula & Syllabus Topics
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Academic Year
                  </p>
                  <h3 className="text-xl font-bold mt-1 text-foreground">
                    {activeYear}
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Currently In Session
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Institutional Details & Administration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Institution Profile Info */}
            <Card className="rounded-2xl border border-border/60 bg-card">
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Institutional Metadata</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Registry data for this educational organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Institution Name</span>
                    <span className="font-semibold text-foreground">{school?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Registered Date</span>
                    <span className="font-semibold text-foreground">{formatDate(school?.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Platform Mode</span>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      Multi-Tenant Assessment
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground font-medium">System Health</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Online & Synchronized
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* School Administrator Profile */}
            <Card className="rounded-2xl border border-border/60 bg-card">
              <CardHeader className="p-5 pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Administrator Authority</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Current institutional governance and access rights.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-primary/[0.04] border border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary font-black text-sm flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {user?.name || "School Administrator"}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {user?.email || "admin@learnhub.com"}
                    </p>
                  </div>
                  <Badge className="ml-auto bg-primary text-primary-foreground text-[11px] font-semibold">
                    School Admin
                  </Badge>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Authorized Administrative Capabilities:
                  </p>
                  <ul className="text-xs space-y-1.5 text-foreground/80 list-disc list-inside">
                    <li>School Membership & User Role provisioning</li>
                    <li>Academic Terms & Cohort Section management</li>
                    <li>Teaching Educator assignment across subjects</li>
                    <li>Parent-Student guardian relation linking</li>
                    <li>Master Subject catalog registration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
