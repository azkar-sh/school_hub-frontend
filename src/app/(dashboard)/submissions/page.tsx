"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
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
    filteredSubmissions,
    isLoadingSubmissions,
  } = useSubmissionsPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <Input
              placeholder={
                currentRole === "TEACHER"
                  ? "Search by student or assessment title…"
                  : "Search by assessment title or subject…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "role" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as StatusFilter)}
                className="capitalize text-xs"
              >
                {status === "ALL" ? "All" : status === "SUBMITTED" ? "Pending Review" : "Graded"}
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
