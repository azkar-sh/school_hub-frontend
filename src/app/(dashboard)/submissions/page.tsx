"use client";

import Link from "next/link";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles, Filter } from "lucide-react";
import { useSubmissionsPage, STATUS_FILTERS, StatusFilter } from "./hooks";
import { SubmissionsTableCard } from "./_components/SubmissionsTableCard";

export default function SubmissionsPage() {
  const {
    currentRole,
    isDemoMode,
    pageTitle,
    pageDescription,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    assessmentFilter,
    setAssessmentFilter,
    assessmentOptions,
    subjectFilter,
    setSubjectFilter,
    subjectOptions,
    filteredSubmissions,
    isLoadingSubmissions,
    firstPendingSubmissionId,
    pendingCount,
  } = useSubmissionsPage();

  const isTeacher = currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
        </div>

        {/* 1-Click Fast Grade CTA for Teachers */}
        {isTeacher && firstPendingSubmissionId && (
          <Link href={`/submissions/${firstPendingSubmissionId}`}>
            <Button
              variant="role"
              size="default"
              className="font-bold gap-2 shadow-sm w-full sm:w-auto h-11"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Grading ({pendingCount} Pending)</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <Input
              placeholder={
                currentRole === "TEACHER"
                  ? "Search student or assessment title…"
                  : "Search assessment title or subject…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Assessment dropdown filter */}
          {assessmentOptions.length > 0 && (
            <select
              value={assessmentFilter}
              onChange={(e) => setAssessmentFilter(e.target.value)}
              className="flex h-10 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary w-full md:w-56"
            >
              <option value="ALL">All Assessments</option>
              {assessmentOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          )}

          {/* Subject dropdown filter */}
          {subjectOptions.length > 0 && (
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="flex h-10 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary w-full md:w-44"
            >
              <option value="ALL">All Subjects</option>
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          )}

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "role" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as StatusFilter)}
                className="capitalize text-xs h-10 px-3 shrink-0"
              >
                {status === "ALL"
                  ? "All"
                  : status === "SUBMITTED"
                    ? "Pending Review"
                    : "Graded"}
              </Button>
            ))}
          </div>
        </div>
      </Card>


      {/* Loading state (live mode only) */}
      {!isDemoMode && isLoadingSubmissions && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading submissions…</span>
        </div>
      )}

      {/* Submissions List Card */}
      {(!isLoadingSubmissions || isDemoMode) && (
        <SubmissionsTableCard
          currentRole={currentRole}
          submissions={filteredSubmissions}
        />
      )}
    </div>
  );
}
