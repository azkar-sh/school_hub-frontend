'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Sparkles, ArrowRight, FileText, List } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { cn } from '@/lib/utils';

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
  viewMode?: 'cards' | 'table';
  onViewToggle?: (mode: 'cards' | 'table') => void;
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
  cardGridCols?: '1' | '2' | '3' | '4';
  getItemKey?: (item: TItem, index: number) => string | number;
  className?: string;
}

const gridColsClass: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function DataDisplay<TItem>({
  title,
  description,
  searchPlaceholder = 'Search...',
  search,
  onSearchChange,
  filters = [],
  activeFilter,
  onFilterChange,
  items,
  isDemoMode = false,
  pagination,
  onPageChange,
  viewMode = 'cards',
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
  cardGridCols = '2',
  getItemKey,
  className = '',
}: DataDisplayProps<TItem>) {
  const { isDemoMode: storeIsDemoMode } = useAuthStore();
  const demoMode = isDemoMode ?? storeIsDemoMode;

  const hasItems = items.length > 0;
  const showContent = !isLoading && !demoMode;
  const showToolbar = showSearch || showFilters || showViewToggle;

  const resolveKey = React.useCallback(
    (item: TItem, index: number): string | number => {
      if (getItemKey) return getItemKey(item, index);
      const id = (item as { id?: string | number }).id;
      return id !== undefined && id !== null ? id : index;
    },
    [getItemKey],
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const toggleView = () => {
    onViewToggle?.(viewMode === 'cards' ? 'table' : 'cards');
  };

  const goToPrev = () => {
    if (pagination) onPageChange?.(Math.max(1, pagination.page - 1));
  };

  const goToNext = () => {
    if (pagination) onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Demo Mode Banner */}
      {showDemoBanner && demoMode && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 min-w-0">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-semibold shrink-0">Preview Mode</span>
            <span className="text-amber-600/80 dark:text-amber-400/70 text-xs truncate hidden sm:block">
              — You are viewing sample demo data. Sign in with a real account to access live information.
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

      {/* Header with title and controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 sm:mt-0">
              {description}
            </p>
          )}
        </div>

        {/* Controls: Search, Filters, View Toggle */}
        {showToolbar && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {showSearch && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={handleSearchInput}
                  className="pl-10"
                />
              </div>
            )}

            {showFilters && filters.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? 'role' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange(filter.value)}
                    className="capitalize text-xs"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}

            {showViewToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleView}
                className="flex items-center gap-1 text-xs"
              >
                {viewMode === 'cards' ? (
                  <>
                    <List className="w-4 h-4" />
                    <span>Table View</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Cards View</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Pagination summary when toolbar hidden */}
        {showPaginationSummary && !showToolbar && pagination && !demoMode && pagination.total > 0 && (
          <div className="text-xs text-muted-foreground">
            <span>
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && !demoMode && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading data…</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && !demoMode && (
        <div className="p-4 text-sm text-destructive text-center border rounded-xl border-destructive/20 bg-destructive/5">
          {error}
        </div>
      )}

      {/* Empty state */}
      {showContent && !hasItems && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No items match your search.
          </p>
        </div>
      )}

      {/* Main content — cards view */}
      {showContent && hasItems && viewMode === 'cards' && renderCard && (
        <div className={cn('grid gap-5', gridColsClass[cardGridCols])}>
          {items.map((item, index) => (
            <div key={resolveKey(item, index)}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Main content — table view */}
      {showContent && hasItems && viewMode === 'table' && renderTableHeaders && renderTableRow && (
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
                          'p-3 font-semibold',
                          idx === 0 && 'rounded-l-xl',
                          idx === arr.length - 1 && 'rounded-r-xl',
                          header.className,
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

      {/* Main content — fallback list view */}
      {showContent && hasItems && viewMode === 'cards' && !renderCard && (
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

      {/* Pagination controls */}
      {showPagination && pagination && !demoMode && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
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
