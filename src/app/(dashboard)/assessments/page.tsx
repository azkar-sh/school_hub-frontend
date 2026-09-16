"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useAssessmentsPage } from "./hooks";
import { AssessmentsHeader } from "./_components/AssessmentsHeader";
import { AssessmentsToolbar } from "./_components/AssessmentsToolbar";
import { AssessmentsGrid } from "./_components/AssessmentsGrid";
import { AssessmentsPagination } from "./_components/AssessmentsPagination";
import { AssessmentsLoading } from "./_components/AssessmentsLoading";
import { AssessmentsError } from "./_components/AssessmentsError";

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

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Header with title and create button */}
      <AssessmentsHeader currentRole={currentRole} />

      {/* Toolbar with search and filters */}
      <AssessmentsToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filterType={filterType}
        onFilterTypeChange={handleFilterTypeChange}
        isDemoMode={isDemoMode}
        meta={meta}
      />

      {/* Loading state */}
      {!isDemoMode && isLoading && <AssessmentsLoading />}

      {/* Error state */}
      {!isDemoMode && fetchError && <AssessmentsError />}

      {/* Main content */}
      {(!isLoading || isDemoMode) && !fetchError && (
        <>
          <AssessmentsGrid
            currentRole={currentRole}
            items={filtered}
            actionLabel={actionLabel}
          />

          {/* Pagination controls */}
          {!isDemoMode && meta.totalPages > 1 && (
            <AssessmentsPagination
              meta={meta}
              onPageChange={setPage}
              isDemoMode={isDemoMode}
            />
          )}
        </>
      )}
    </div>
  );
}