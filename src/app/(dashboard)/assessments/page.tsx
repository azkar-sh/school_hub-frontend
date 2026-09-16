"use client";

import * as React from "react";
import Link from "next/link";
import { DataDisplay } from "@/components/ui/DataDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, BookOpen } from "lucide-react";
import { useAssessmentsPage } from "./hooks";
import { AssessmentCard } from "./_components/AssessmentCard";
import type { MockAssessment } from "@/lib/mock-data";

const TYPE_FILTERS = [
  { value: "ALL", label: "all" },
  { value: "QUIZ", label: "quiz" },
  { value: "EXAM", label: "exam" },
  { value: "ASSIGNMENT", label: "assignment" },
];

function getAssessmentTypeLabel(type: string) {
  switch (type) {
    case "QUIZ":
      return "quiz";
    case "EXAM":
      return "exam";
    case "ASSIGNMENT":
      return "assignment";
    default:
      return type.toLowerCase();
  }
}

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className="text-[10px] uppercase">
      {type}
    </Badge>
  );
}

export default function AssessmentsPage() {
  const {
    isDemoMode,
    currentRole,
    search,
    filterType,
    handleSearchChange,
    handleFilterTypeChange,
    setPage,
    isLoading,
    fetchError,
    filtered,
    meta,
    actionLabel,
  } = useAssessmentsPage();

  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const title =
    currentRole === "TEACHER" ? "My Assessments" : "Assessments & Quizzes";
  const description =
    currentRole === "TEACHER"
      ? "Manage and publish your assessments, quizzes, and exams"
      : currentRole === "PARENT"
        ? "Browse your child's assessment results and upcoming tests"
        : "Browse, practice, or start your class assessments";

  const searchPlaceholder = isDemoMode
    ? "Search by title or subject…"
    : "Search by title (server)…";

  const renderCard = React.useCallback(
    (item: MockAssessment) => (
      <AssessmentCard
        currentRole={currentRole}
        item={item}
        actionLabel={actionLabel}
      />
    ),
    [currentRole, actionLabel],
  );

  const renderTableHeaders = React.useCallback(
    () => [
      { key: "title", label: "Title" },
      { key: "type", label: "Type" },
      { key: "subject", label: "Subject" },
      { key: "questions", label: "Questions", className: "text-center" },
      { key: "due", label: "Due" },
      { key: "status", label: "Status" },
      { key: "action", label: "", className: "w-10" },
    ],
    [],
  );

  const renderTableRow = React.useCallback(
    (item: MockAssessment) => [
      <td key="title" className="p-3.5 font-medium">
        <Link
          href={`/assessments/${item.id}`}
          className="hover:text-primary transition-colors"
        >
          {item.title}
        </Link>
      </td>,
      <td key="type" className="p-3.5">
        <TypeBadge type={item.type} />
      </td>,
      <td key="subject" className="p-3.5 text-xs text-muted-foreground">
        {item.subject}
      </td>,
      <td key="questions" className="p-3.5 text-center text-sm">
        {item.questionsCount}
      </td>,
      <td key="due" className="p-3.5 text-xs text-muted-foreground">
        {item.due}
      </td>,
      <td key="status" className="p-3.5">
        <span className="inline-flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          {getAssessmentTypeLabel(item.type)}
        </span>
      </td>,
      <td key="action" className="p-3.5">
        <Link href={`/assessments/${item.id}`}>
          <Button variant="role" size="sm" className="text-xs">
            {actionLabel(item)}
          </Button>
        </Link>
      </td>,
    ],
    [actionLabel],
  );

  const paginationSummary =
    !isDemoMode && meta.total > 0
      ? `Showing ${(meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total}`
      : undefined;

  return (
    <div className="space-y-6">
      {/* Pagination summary banner (mirrors old AssessmentsToolbar summary) */}
      {/* {paginationSummary && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>{paginationSummary}</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
        </div>
      )} */}

      <DataDisplay<MockAssessment>
        title={title}
        description={description}
        searchPlaceholder={searchPlaceholder}
        search={search}
        onSearchChange={handleSearchChange}
        filters={TYPE_FILTERS}
        activeFilter={filterType}
        onFilterChange={handleFilterTypeChange}
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
        error={
          fetchError
            ? "Failed to load assessments. Please refresh the page."
            : undefined
        }
        showSearch
        showFilters
        showViewToggle
        showDemoBanner
        showPagination
        showPaginationSummary={true}
        cardGridCols="2"
        getItemKey={(item) => item.id}
        headerAction={
          currentRole === "TEACHER" ? (
            <Link href="/assessments/new">
              <Button variant="role" className="shadow-md">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </Link>
          ) : undefined
        }
      />
    </div>
  );
}
