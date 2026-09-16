"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";

export interface DataDisplayFilter {
  value: string;
  label: string;
}

export interface DataDisplayPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataDisplayTableHeader {
  key: string;
  label: string;
  className?: string;
}

interface DataDisplayProps<TItem> {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  filters?: DataDisplayFilter[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  items: TItem[];
  isDemoMode?: boolean;
  pagination?: DataDisplayPagination;
  onPageChange?: (page: number) => void;
  viewMode?: "cards" | "table";
  onViewToggle?: (mode: "cards" | "table") => void;
  renderCard?: (item: TItem) => React.ReactNode;
  renderTableHeaders?: () => DataDisplayTableHeader[];
  renderTableRow?: (item: TItem) => React.ReactNode[];
  isLoading?: boolean;
  error?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showPagination?: boolean;
  showDemoBanner?: boolean;
  showPaginationSummary?: boolean;
  cardGridCols?: "1" | "2" | "3" | "4";
  getItemKey?: (item: TItem, index: number) => string | number;
  headerAction?: React.ReactNode;
  toolbarExtra?: React.ReactNode;
  className?: string;
}

const gridColsClass: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function DataDisplay<TItem>({
  title,
  description,
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  filters = [],
  activeFilter,
  onFilterChange,
  items,
  isDemoMode = false,
  pagination,
  onPageChange,
  viewMode = "cards",
  onViewToggle,
  renderCard,
  renderTableHeaders,
  renderTableRow,
  isLoading = false,
  error,
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  showPagination = true,
  showDemoBanner = true,
  showPaginationSummary = true,
  cardGridCols = "2",
  getItemKey,
  headerAction,
  toolbarExtra,
  className = "",
}: DataDisplayProps<TItem>) {
  const { isDemoMode: storeIsDemoMode } = useAuthStore();
  const demoMode = isDemoMode ?? storeIsDemoMode;

  const hasItems = items.length > 0;
  const isBlocked = isLoading && !demoMode;
  const hasFilters = showFilters && filters.length > 0;
  const showToolbar =
    showSearch || hasFilters || showViewToggle || !!toolbarExtra;

  const resolveKey = React.useCallback(
    (item: TItem, index: number): string | number => {
      if (getItemKey) return getItemKey(item, index);
      const id = (item as { id?: string | number }).id;
      return id !== undefined && id !== null ? id : index;
    },
    [getItemKey]
  );

  const goToPrev = () => {
    if (pagination) onPageChange?.(Math.max(1, pagination.page - 1));
  };

  const goToNext = () => {
    if (pagination)
      onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1));
  };

  return (
    <div className={cn("space-y-5", className)}>
      {showDemoBanner && demoMode && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 min-w-0">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-semibold shrink-0">Preview Mode</span>
            <span className="text-amber-600/80 dark:text-amber-400/70 text-xs truncate hidden sm:block">
              — You are viewing sample demo data. Sign in with a real account to
              access live information.
            </span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/60 text-xs gap-1 h-8"
            >
              Sign In
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl leading-tight">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {showPaginationSummary &&
              pagination &&
              !demoMode &&
              pagination.total > 0 &&
              !showToolbar && (
                <p className="text-xs text-muted-foreground pt-1">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total}
                </p>
              )}
          </div>
          {headerAction && (
            <div className="shrink-0 lg:pl-4">{headerAction}</div>
          )}
        </div>

        {showToolbar && (
          <div className="rounded-xl border bg-card shadow-xs">
            <div className="flex flex-col gap-3 p-3 sm:p-3.5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap min-w-0">
                  {showSearch && (
                    <div className="relative w-full sm:w-[280px] lg:w-[320px] shrink-0">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9 bg-background"
                      />
                    </div>
                  )}

                  {(hasFilters || toolbarExtra) && (
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      {hasFilters && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {filters.map((filter) => (
                            <Button
                              key={filter.value}
                              variant={
                                activeFilter === filter.value ? "role" : "outline"
                              }
                              size="sm"
                              onClick={() => onFilterChange(filter.value)}
                              className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap"
                            >
                              {filter.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      {toolbarExtra && (
                        <>
                          {hasFilters && (
                            <div className="hidden sm:block h-6 w-px bg-border mx-1" />
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            {toolbarExtra}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end lg:shrink-0">
                  {showPaginationSummary &&
                    pagination &&
                    !demoMode &&
                    pagination.total > 0 && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap lg:text-right">
                        <span className="hidden sm:inline">
                          {pagination.total} items · Page {pagination.page} of{" "}
                          {pagination.totalPages}
                        </span>
                        <span className="sm:hidden">
                          {pagination.page}/{pagination.totalPages} · {pagination.total} items
                        </span>
                      </span>
                    )}

                  {showViewToggle && onViewToggle && (
                    <div className="inline-flex items-center rounded-full border bg-muted/40 p-1 gap-0.5 shrink-0 ml-auto lg:ml-0">
                      <button
                        type="button"
                        aria-pressed={viewMode === "cards"}
                        onClick={() => onViewToggle("cards")}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          viewMode === "cards"
                            ? "bg-background shadow-sm border text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Cards
                      </button>
                      <button
                        type="button"
                        aria-pressed={viewMode === "table"}
                        onClick={() => onViewToggle("table")}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          viewMode === "table"
                            ? "bg-background shadow-sm border text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <List className="h-3.5 w-3.5" />
                        Table
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && !demoMode && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading data…</span>
        </div>
      )}

      {error && !isLoading && !demoMode && (
        <div className="p-4 text-sm text-destructive text-center border rounded-xl border-destructive/20 bg-destructive/5">
          {error}
        </div>
      )}

      {!isBlocked && !hasItems && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No items match your search.
          </p>
        </div>
      )}

      {!isBlocked && hasItems && viewMode === "cards" && renderCard && (
        <div className={cn("grid gap-5", gridColsClass[cardGridCols])}>
          {items.map((item, index) => (
            <div key={resolveKey(item, index)}>{renderCard(item)}</div>
          ))}
        </div>
      )}

      {!isBlocked &&
        hasItems &&
        viewMode === "table" &&
        renderTableHeaders &&
        renderTableRow && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-muted-foreground bg-muted/50 rounded-xl">
                    <tr>
                      {renderTableHeaders().map((header, idx, arr) => (
                        <th
                          key={header.key}
                          className={cn(
                            "p-3 font-semibold",
                            idx === 0 && "rounded-l-xl",
                            idx === arr.length - 1 && "rounded-r-xl",
                            header.className
                          )}
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {items.map((item, index) => (
                      <tr
                        key={resolveKey(item, index)}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {renderTableRow(item)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

      {!isBlocked && hasItems && viewMode === "cards" && !renderCard && (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={resolveKey(item, index)}
              className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/100 transition-colors"
            >
              <p className="font-medium">{String(item)}</p>
            </div>
          ))}
        </div>
      )}

      {showPagination &&
        pagination &&
        !demoMode &&
        pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={goToPrev}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={goToNext}
            >
              Next
            </Button>
          </div>
        )}
    </div>
  );
}
