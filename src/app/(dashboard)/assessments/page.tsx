"use client";

import * as React from "react";
import Link from "next/link";
import { DataDisplay, FilterGroup } from "@/components/ui/DataDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, BookOpen } from "lucide-react";
import { useAssessmentsPage } from "./hooks";
import { AssessmentCard } from "./_components/AssessmentCard";
import type { MockAssessment } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

const TYPE_FILTERS = [
  { value: "ALL", label: "all" },
  { value: "QUIZ", label: "quiz" },
  { value: "EXAM", label: "exam" },
  { value: "ASSIGNMENT", label: "assignment" },
];

function getAssessmentTypeLabel(type: string) {
  switch (type) {
    case "QUIZ":
      return "Quiz"; // i18n: TODO
    case "EXAM":
      return "Exam"; // i18n: TODO
    case "ASSIGNMENT":
      return "Assignment"; // i18n: TODO
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
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
  const t = useTranslations("Assessments");
  const {
    isDemoMode,
    currentRole,
    search,
    filterType,
    filterSubject,
    filterClass,
    subjectOptions,
    classOptions,
    handleSearchChange,
    handleFilterTypeChange,
    handleFilterSubjectChange,
    handleFilterClassChange,
    setPage,
    isLoading,
    fetchError,
    filtered,
    meta,
    actionLabel,
  } = useAssessmentsPage();

  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const title =
    currentRole === "TEACHER" ? t("pageTitleTeacher") : t("pageTitleDefault");
  const description =
    currentRole === "TEACHER"
      ? t("pageDescTeacher")
      : currentRole === "PARENT"
        ? t("pageDescParent")
        : t("pageDescStudent");

  const searchPlaceholder = isDemoMode
    ? t("searchPlaceholderDemo")
    : t("searchPlaceholderServer");

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
      { key: "title", label: t("tableTitle") },
      { key: "type", label: t("tableType") },
      { key: "subject", label: t("tableSubject") },
      { key: "questions", label: t("tableQuestions"), className: "text-center" },
      { key: "due", label: t("tableDue") },
      { key: "status", label: t("tableStatus") },
      { key: "action", label: "", className: "w-10" },
    ],
    [t],
  );

  const renderStatus = React.useCallback(
    (item: MockAssessment) =>
      currentRole === "STUDENT"
        ? getAssessmentTypeLabel(item.status).toUpperCase()
        : item.dueAt > new Date().toLocaleDateString("id-ID")
          ? t("statusAvailable")
          : t("statusExpired"),
    [currentRole, t],
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
        {item.dueAt}
      </td>,
      <td key="status" className="p-3.5">
        <span className="inline-flex items-center gap-1.5 text-xs">
          {renderStatus(item)}
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
    [actionLabel, renderStatus],
  );

  const paginationSummary =
    !isDemoMode && meta.total > 0
      ? t("showing", {
          start: (meta.page - 1) * meta.limit + 1,
          end: Math.min(meta.page * meta.limit, meta.total),
          total: meta.total,
        })
      : undefined;

  const filterGroups = React.useMemo<FilterGroup[]>(
    () => [
      {
        id: "type",
        mode: "multi",
        variant: "dropdown",
        options: TYPE_FILTERS.filter((f) => f.value !== "ALL").map((f) => ({
          value: f.value,
          label: t(f.label),
        })),
        value: filterType,
        onChange: (v) => handleFilterTypeChange(v),
        placeholder: t("filterAllTypes"),
      },
      ...(currentRole === "STUDENT"
        ? [
            {
              id: "subject",
              mode: "multi" as const,
              variant:
                subjectOptions.length > 6
                  ? ("combobox" as const)
                  : ("dropdown" as const),
              options: subjectOptions,
              value: filterSubject,
              onChange: (v: string | string[]) => handleFilterSubjectChange(v),
              placeholder: t("filterAllSubjects"),
              searchable: subjectOptions.length > 6,
            },
          ]
        : []),
      ...(currentRole === "TEACHER"
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
              placeholder: t("filterAllClasses"),
              searchable: classOptions.length > 6,
            },
          ]
        : []),
    ],
    [
      currentRole,
      filterType,
      filterSubject,
      filterClass,
      subjectOptions,
      classOptions,
      handleFilterTypeChange,
      handleFilterSubjectChange,
      handleFilterClassChange,
      t,
    ],
  );

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
        error={
          fetchError
            ? t("errorFailedLoad")
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
                {t("createAssessment")}
              </Button>
            </Link>
          ) : undefined
        }
      />
    </div>
  );
}
