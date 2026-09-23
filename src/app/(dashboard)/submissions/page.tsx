"use client";

import * as React from "react";
import Link from "next/link";
import { DataDisplay, FilterGroup } from "@/components/ui/DataDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { useSubmissionsPage, STATUS_FILTERS } from "./hooks";
import { SubmissionCard } from "./_components/SubmissionCard";
import { SubmissionRow } from "@/lib/mock-data";

const STATUS_OPTIONS = STATUS_FILTERS.filter((s) => s !== "ALL").map((s) => ({
  value: s,
  label: s === "SUBMITTED" ? "Pending Review" : "Graded",
}));

export default function SubmissionsPage() {
  const {
    currentRole,
    isDemoMode,
    pageTitle,
    pageDescription,
    search,
    handleSearchChange,
    filterStatus,
    handleFilterStatusChange,
    filterSubject,
    handleFilterSubjectChange,
    filterClass,
    handleFilterClassChange,
    subjectOptions,
    classOptions,
    filtered,
    isLoading,
    fetchError,
    meta,
    setPage,
    firstPendingSubmissionId,
    pendingCount,
  } = useSubmissionsPage();

  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const isTeacher = currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";

  const startGradingHref = React.useMemo(() => {
    const params = new URLSearchParams();
    if (filterSubject.length > 0) params.set("subjectId", filterSubject.join(","));
    if (filterClass.length > 0) params.set("classId", filterClass.join(","));
    const qs = params.toString();
    return `/submissions/${firstPendingSubmissionId}${qs ? `?${qs}` : ""}`;
  }, [firstPendingSubmissionId, filterSubject, filterClass]);

  const searchPlaceholder = isTeacher
    ? "Search student or assessment title…"
    : "Search assessment title or subject…";

  const renderCard = React.useCallback(
    (item: SubmissionRow) => (
      <SubmissionCard currentRole={currentRole} item={item} />
    ),
    [currentRole],
  );

  const renderTableHeaders = React.useCallback(
    () => [
      { key: isTeacher ? "student" : "assessment", label: isTeacher ? "Student" : "Assessment" },
      { key: isTeacher ? "assessment" : "subject", label: isTeacher ? "Assessment Title" : "Subject" },
      { key: "submittedAt", label: "Submitted At" },
      { key: "status", label: "Status" },
      { key: "score", label: "Score", className: "text-right" },
      { key: "action", label: "", className: "w-8" },
    ],
    [isTeacher],
  );

  const renderTableRow = React.useCallback(
    (item: SubmissionRow) => [
      <td key="primary" className="p-3.5 font-medium">
        <Link
          href={`/submissions/${item.id}`}
          className="hover:text-primary transition-colors"
        >
          {isTeacher ? item.studentName : item.assessmentTitle}
        </Link>
      </td>,
      <td key="secondary" className="p-3.5 font-medium text-foreground">
        <Link href={`/submissions/${item.id}`}>
          {isTeacher ? item.assessmentTitle : item.subject}
        </Link>
      </td>,
      <td key="submittedAt" className="p-3.5 text-xs text-muted-foreground">
        <Link href={`/submissions/${item.id}`}>{item.submittedAt}</Link>
      </td>,
      <td key="status" className="p-3.5">
        <Link href={`/submissions/${item.id}`}>
          {item.status === "GRADED" ? (
            <Badge
              variant="secondary"
              className="bg-success/15 text-success gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Graded
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-warning border-warning/30 gap-1"
            >
              <Clock className="w-3 h-3" />
              Pending Review
            </Badge>
          )}
        </Link>
      </td>,
      <td key="score" className="p-3.5 text-right font-extrabold text-base text-foreground">
        <Link href={`/submissions/${item.id}`}>
          {item.score !== null ? `${item.score}%` : "—"}
        </Link>
      </td>,
      <td key="action" className="p-3.5 w-8">
        <Link
          href={`/submissions/${item.id}`}
          className="flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </td>,
    ],
    [isTeacher],
  );

  const filterGroups = React.useMemo<FilterGroup[]>(
    () => [
      {
        id: "status",
        mode: "multi",
        variant: "dropdown",
        options: STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
        value: filterStatus,
        onChange: (v) => handleFilterStatusChange(v),
        placeholder: "All Statuses",
      },
      {
        id: "subject",
        mode: "multi",
        variant:
          subjectOptions.length > 6 ? ("combobox" as const) : ("dropdown" as const),
        options: subjectOptions,
        value: filterSubject,
        onChange: (v: string | string[]) => handleFilterSubjectChange(v),
        placeholder: "All Subjects",
        searchable: subjectOptions.length > 6,
      },
      ...(isTeacher
        ? [
            {
              id: "class",
              mode: "multi" as const,
              variant:
                classOptions.length > 6
                  ? ("combobox" as const)
                  : ("dropdown" as const),
              options: classOptions,
              value: filterClass,
              onChange: (v: string | string[]) => handleFilterClassChange(v),
              placeholder: "All Classes",
              searchable: classOptions.length > 6,
            },
          ]
        : []),
    ],
    [
      isTeacher,
      filterStatus,
      filterSubject,
      filterClass,
      subjectOptions,
      classOptions,
      handleFilterStatusChange,
      handleFilterSubjectChange,
      handleFilterClassChange,
    ],
  );

  return (
    <div className="space-y-6">
      <DataDisplay<SubmissionRow>
        title={pageTitle}
        description={pageDescription}
        searchPlaceholder={searchPlaceholder}
        search={search}
        onSearchChange={handleSearchChange}
        filterGroups={filterGroups}
        items={filtered}
        isDemoMode={isDemoMode}
        pagination={meta}
        onPageChange={(p) => setPage(p)}
        viewMode={viewMode}
        onViewToggle={setViewMode}
        renderCard={renderCard}
        renderTableHeaders={renderTableHeaders}
        renderTableRow={renderTableRow}
        isLoading={isLoading}
        error={fetchError ? "Failed to load submissions" : undefined}
        showSearch
        showFilters
        showViewToggle
        showDemoBanner
        showPagination
        showPaginationSummary
        cardGridCols="2"
        getItemKey={(item) => item.id}
        headerAction={
          isTeacher && firstPendingSubmissionId ? (
            <Link href={startGradingHref}>
              <Button variant="role" className="shadow-md">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Grading ({pendingCount} Pending)
              </Button>
            </Link>
          ) : undefined
        }
      />
    </div>
  );
}
