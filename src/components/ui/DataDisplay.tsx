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
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface DataDisplayFilter {
  value: string;
  label: string;
}

export interface FilterGroupOption {
  value: string;
  label: string;
}

export type FilterVariant = "pills" | "select" | "dropdown" | "combobox";

export interface FilterGroup {
  id: string;
  label?: string;
  mode: "single" | "multi";
  variant?: FilterVariant;
  options: FilterGroupOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
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
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  filterGroups?: FilterGroup[];
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

function resolveVariant(group: FilterGroup): FilterVariant {
  if (group.variant) return group.variant;
  if (group.mode === "multi") return group.searchable ? "combobox" : "dropdown";
  return "select";
}

function FilterSelect({ group }: { group: FilterGroup }) {
  const value = group.value as string;
  const placeholder =
    group.placeholder ?? `Select ${group.label?.toLowerCase() ?? ""}`;
  return (
    <Select value={value} onValueChange={(v) => group.onChange(v as string)}>
      <SelectTrigger size="sm" className="h-8 min-w-32 bg-background">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {group.options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterDropdown({ group }: { group: FilterGroup }) {
  const selected = group.value as string[];
  const label =
    selected.length === 0
      ? (group.placeholder ?? group.label)
      : selected.length === 1
        ? (group.options.find((o) => o.value === selected[0])?.label ??
          selected[0])
        : `${selected.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 bg-background"
          >
            {label}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
          {group.options.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={selected.includes(opt.value)}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...selected, opt.value]
                  : selected.filter((v) => v !== opt.value);
                group.onChange(next);
              }}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs"
                onClick={() => group.onChange([])}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterCombobox({ group }: { group: FilterGroup }) {
  const selected = group.value as string[];
  const placeholder =
    group.placeholder ?? `Search ${group.label?.toLowerCase() ?? ""}…`;
  const triggerLabel =
    selected.length === 0
      ? group.label
      : selected.length === 1
        ? (group.options.find((o) => o.value === selected[0])?.label ??
          selected[0])
        : `${selected.length} selected`;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 bg-background"
          >
            {triggerLabel}
            {selected.length > 1 && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] leading-none"
              >
                {selected.length}
              </Badge>
            )}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {group.options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      const next = isSelected
                        ? selected.filter((v) => v !== opt.value)
                        : [...selected, opt.value];
                      group.onChange(next);
                    }}
                  >
                    <Checkbox checked={isSelected} className="mr-2" />
                    {opt.label}
                    {isSelected && <Check className="ml-auto h-3.5 w-3.5" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-t p-2">
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => group.onChange([])}
              >
                Clear
              </Button>
            </div>
          )}
        </Command>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 border-t p-2">
            {selected.map((val) => {
              const opt = group.options.find((o) => o.value === val);
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs"
                >
                  {opt?.label ?? val}
                  <button
                    type="button"
                    onClick={() =>
                      group.onChange(selected.filter((v) => v !== val))
                    }
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function FilterPills({ group }: { group: FilterGroup }) {
  if (group.mode === "single") {
    const active = group.value as string;
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {group.options.map((opt) => (
          <Button
            key={opt.value}
            variant={active === opt.value ? "role" : "outline"}
            size="sm"
            onClick={() => group.onChange(opt.value)}
            className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    );
  }
  const selected = group.value as string[];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {group.options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <Button
            key={opt.value}
            variant={isActive ? "role" : "outline"}
            size="sm"
            onClick={() => {
              const next = isActive
                ? selected.filter((v) => v !== opt.value)
                : [...selected, opt.value];
              group.onChange(next);
            }}
            className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap"
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}

export function DataDisplay<TItem>({
  title,
  description,
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  filters = [],
  activeFilter,
  onFilterChange,
  filterGroups = [],
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
  const hasFilterGroups = showFilters && filterGroups.length > 0;
  const hasAnyFilters = hasFilters || hasFilterGroups;
  const showToolbar =
    showSearch || hasAnyFilters || showViewToggle || !!toolbarExtra;

  const resolveKey = React.useCallback(
    (item: TItem, index: number): string | number => {
      if (getItemKey) return getItemKey(item, index);
      const id = (item as { id?: string | number }).id;
      return id !== undefined && id !== null ? id : index;
    },
    [getItemKey],
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
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-warning/30 bg-warning/8 px-4 py-3 text-sm">
          <div className="flex items-center gap-2.5 text-warning min-w-0">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-semibold shrink-0">Preview Mode</span>
            <span className="text-warning/80 text-xs truncate hidden sm:block">
              — You are viewing sample demo data. Sign in with a real account to
              access live information.
            </span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-warning/40 text-warning hover:bg-warning/15 hover:border-warning/60 text-xs gap-1 h-8"
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
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total}
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
                    <div
                      className={`relative  shrink-0 ${filterGroups.length > 2 ? "w-full sm:w-1/3 lg:w-1/3" : "w-full sm:w-1/2 lg:w-1/2"}`}
                    >
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9 bg-background"
                      />
                    </div>
                  )}

                  {(hasAnyFilters || toolbarExtra) && (
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      {hasFilterGroups &&
                        filterGroups.map((group) => {
                          const variant = resolveVariant(group);
                          return (
                            <div
                              key={group.id}
                              className="flex items-center gap-1"
                            >
                              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">
                                {group.label}
                              </span>
                              {variant === "pills" && (
                                <FilterPills group={group} />
                              )}
                              {variant === "select" && (
                                <FilterSelect group={group} />
                              )}
                              {variant === "dropdown" && (
                                <FilterDropdown group={group} />
                              )}
                              {variant === "combobox" && (
                                <FilterCombobox group={group} />
                              )}
                            </div>
                          );
                        })}
                      {hasFilters && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {filters.map((filter) => (
                            <Button
                              key={filter.value}
                              variant={
                                activeFilter === filter.value
                                  ? "role"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => onFilterChange?.(filter.value)}
                              className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap"
                            >
                              {filter.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      {toolbarExtra && (
                        <>
                          {hasAnyFilters && (
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
                          {pagination.total} items
                          {/* · Page {pagination.page} of{" "}
                          {pagination.totalPages} */}
                        </span>
                        <span className="sm:hidden">
                          {pagination.page}/{pagination.totalPages} ·{" "}
                          {pagination.total} items
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
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        {/* Cards */}
                      </button>
                      <button
                        type="button"
                        aria-pressed={viewMode === "table"}
                        onClick={() => onViewToggle("table")}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          viewMode === "table"
                            ? "bg-background shadow-sm border text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <List className="h-3.5 w-3.5" />
                        {/* Table */}
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
