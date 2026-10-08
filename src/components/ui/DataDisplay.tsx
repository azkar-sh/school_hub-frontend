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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  SlidersHorizontal,
  RotateCcw,
  SearchX,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

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
  children?: React.ReactNode;
  className?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onResetFilters?: () => void;
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

function FilterSelect({
  group,
  className,
}: {
  group: FilterGroup;
  className?: string;
}) {
  const value = (group.value as string) || "";
  const placeholder =
    group.placeholder ?? `Pilih ${group.label?.toLowerCase() ?? ""}`;

  return (
    <Select
      value={value}
      onValueChange={(v) => group.onChange((v as string) || "")}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "h-9 min-w-36 bg-background rounded-xl border-border/80 text-xs font-medium hover:border-border transition-colors",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-lg border-border/80">
        {group.options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-xs font-medium rounded-lg"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterDropdown({
  group,
  className,
}: {
  group: FilterGroup;
  className?: string;
}) {
  const t = useTranslations("Common.DataDisplay");
  const selected = (group.value as string[]) || [];
  const label =
    selected.length === 0
      ? (group.placeholder ?? group.label)
      : selected.length === 1
        ? (group.options.find((o) => o.value === selected[0])?.label ??
          selected[0])
        : `${selected.length} ${t("selected")}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-1.5 bg-background rounded-xl text-xs font-medium border-border/80",
              selected.length > 0 && "border-primary/60 text-primary bg-primary/5",
              className,
            )}
          >
            <span className="truncate max-w-[120px]">{label}</span>
            {selected.length > 1 && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] leading-none"
              >
                {selected.length}
              </Badge>
            )}
            <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-lg">
        <DropdownMenuGroup>
          {group.label && (
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </DropdownMenuLabel>
          )}
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
              className="text-xs font-medium rounded-lg"
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
                className="w-full h-7 text-xs rounded-lg text-muted-foreground hover:text-destructive"
                onClick={() => group.onChange([])}
              >
                {t("resetSelection")}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterCombobox({
  group,
  className,
}: {
  group: FilterGroup;
  className?: string;
}) {
  const t = useTranslations("Common.DataDisplay");
  const selected = (group.value as string[]) || [];
  const placeholder =
    group.placeholder ?? `Cari ${group.label?.toLowerCase() ?? ""}…`;
  const triggerLabel =
    selected.length === 0
      ? group.label
      : selected.length === 1
        ? (group.options.find((o) => o.value === selected[0])?.label ??
          selected[0])
        : `${selected.length} dipilih`;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-1.5 bg-background rounded-xl text-xs font-medium border-border/80",
              selected.length > 0 && "border-primary/60 text-primary bg-primary/5",
              className,
            )}
          >
            <span className="truncate max-w-[120px]">{triggerLabel}</span>
            {selected.length > 1 && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] leading-none"
              >
                {selected.length}
              </Badge>
            )}
            <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
          </Button>
        }
      />
      <PopoverContent className="w-64 p-0 rounded-xl shadow-lg" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="text-xs" />
          <CommandList>
            <CommandEmpty className="text-xs p-3 text-muted-foreground">
              {t("notFound")}
            </CommandEmpty>
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
                    className="text-xs font-medium cursor-pointer"
                  >
                    <Checkbox checked={isSelected} className="mr-2" />
                    <span>{opt.label}</span>
                    {isSelected && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-t p-2">
              <span className="text-xs text-muted-foreground">
                {selected.length} {t("selected")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => group.onChange([])}
              >
                {t("clear")}
              </Button>
            </div>
          )}
        </Command>
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
            className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap transition-all"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    );
  }
  const selected = (group.value as string[]) || [];
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
            className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap transition-all"
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
  searchPlaceholder = "Cari data...",
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
  children,
  className = "",
  emptyStateTitle,
  emptyStateDescription,
  onResetFilters,
}: DataDisplayProps<TItem>) {
  const { isDemoMode: storeIsDemoMode } = useAuthStore();
  const demoMode = isDemoMode ?? storeIsDemoMode;
  const t = useTranslations("Common.DataDisplay");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const hasItems = items.length > 0;
  const isBlocked = isLoading && !demoMode;
  const hasFilters = showFilters && filters.length > 0;
  const hasFilterGroups = showFilters && filterGroups.length > 0;
  const hasAnyFilters = hasFilters || hasFilterGroups;
  const showToolbar =
    showSearch || hasAnyFilters || showViewToggle || !!toolbarExtra;

  // Track active filters count and active pills
  const activeFiltersList = React.useMemo(() => {
    const list: Array<{
      id: string;
      label: string;
      valueLabel: string;
      onClear: () => void;
    }> = [];

    // Search query active
    if (search && search.trim().length > 0) {
      list.push({
        id: "search",
        label: t("search"),
        valueLabel: `"${search.trim()}"`,
        onClear: () => onSearchChange(""),
      });
    }

    // Flat filters active (e.g. ALL / QUIZ / EXAM)
    if (
      hasFilters &&
      activeFilter &&
      activeFilter.toUpperCase() !== "ALL" &&
      activeFilter !== ""
    ) {
      const matched = filters.find((f) => f.value === activeFilter);
      list.push({
        id: "flat-filter",
        label: t("category"),
        valueLabel: matched?.label || activeFilter,
        onClear: () => onFilterChange?.(filters[0]?.value || "ALL"),
      });
    }

    // Filter groups active
    if (hasFilterGroups) {
      filterGroups.forEach((group) => {
        if (group.mode === "single") {
          const val = group.value as string;
          if (val && val.toUpperCase() !== "ALL" && val !== "") {
            const matched = group.options.find((o) => o.value === val);
            list.push({
              id: group.id,
              label: group.label || "Filter",
              valueLabel: matched?.label || val,
              onClear: () => {
                const defaultOpt =
                  group.options.find(
                    (o) =>
                      o.value === "" ||
                      o.value.toUpperCase() === "ALL" ||
                      o.value.toUpperCase() === "SEMUA",
                  )?.value ?? "";
                group.onChange(defaultOpt);
              },
            });
          }
        } else if (group.mode === "multi") {
          const selected = (group.value as string[]) || [];
          selected.forEach((val) => {
            const matched = group.options.find((o) => o.value === val);
            list.push({
              id: `${group.id}-${val}`,
              label: group.label || "Filter",
              valueLabel: matched?.label || val,
              onClear: () => {
                group.onChange(selected.filter((v) => v !== val));
              },
            });
          });
        }
      });
    }

    return list;
  }, [
    search,
    onSearchChange,
    hasFilters,
    activeFilter,
    filters,
    onFilterChange,
    hasFilterGroups,
    filterGroups,
  ]);

  const activeFiltersCount = activeFiltersList.length;

  const handleResetAllFilters = () => {
    if (onResetFilters) {
      onResetFilters();
      return;
    }
    // Default reset behavior
    onSearchChange("");
    if (hasFilters && onFilterChange && filters.length > 0) {
      const allOpt =
        filters.find((f) => f.value.toUpperCase() === "ALL")?.value ??
        filters[0]?.value ??
        "";
      onFilterChange(allOpt);
    }
    if (hasFilterGroups) {
      filterGroups.forEach((group) => {
        if (group.mode === "single") {
          const defaultOpt =
            group.options.find(
              (o) =>
                o.value === "" ||
                o.value.toUpperCase() === "ALL" ||
                o.value.toUpperCase() === "SEMUA",
            )?.value ?? "";
          group.onChange(defaultOpt);
        } else {
          group.onChange([]);
        }
      });
    }
    setIsMobileFilterOpen(false);
  };

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
      {/* Demo Mode Preview Banner */}
      {showDemoBanner && demoMode && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-warning/30 bg-warning/8 px-4 py-3 text-sm">
          <div className="flex items-center gap-2.5 text-warning min-w-0">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-semibold shrink-0">{t("demoMode")}</span>
            <span className="text-warning/80 text-xs truncate hidden sm:block">
              {t("demoDesc")}
            </span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-warning/40 text-warning hover:bg-warning/15 hover:border-warning/60 text-xs gap-1 h-8 rounded-xl"
            >
              {t("signIn")}
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Header & Main Toolbar Container */}
      <div className="flex flex-col gap-4">
        {/* Title and Header Action */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl leading-tight">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {showPaginationSummary &&
              pagination &&
              !demoMode &&
              pagination.total > 0 &&
              !showToolbar && (
                <p className="text-xs text-muted-foreground pt-1">
                  {t("showing")} {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} {t("of")} {pagination.total} {t("records")}
                </p>
              )}
          </div>
          {headerAction && (
            <div className="shrink-0 lg:pl-4">{headerAction}</div>
          )}
        </div>

        {/* Master Toolbar */}
        {showToolbar && (
          <div className="rounded-2xl border border-border/80 bg-card shadow-xs">
            <div className="flex flex-col gap-3 p-3 sm:p-3.5">
              {/* Row 1: Search (Left) & Summary / View Mode Toggle (Right) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search Input (Left) */}
                {showSearch && (
                  <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      role="searchbox"
                      aria-label={searchPlaceholder}
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-9 pr-8 h-9 bg-background rounded-xl text-xs sm:text-sm border-border/80"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        aria-label={t("clearKeyword")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Filter Button & View Mode (Screens below sm) */}
                {(hasAnyFilters || (showViewToggle && onViewToggle)) && (
                  <div className="flex items-center justify-between gap-2 sm:hidden pt-0.5">
                    {hasAnyFilters && (
                      <Button
                        type="button"
                        variant={activeFiltersCount > 0 ? "role" : "outline"}
                        size="sm"
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="h-8 gap-1.5 text-xs rounded-xl flex-1 justify-center min-w-0"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t("filterAndSort")}</span>
                        {activeFiltersCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1.5 text-[10px] bg-background/80 text-foreground shrink-0"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    )}

                    {showViewToggle && onViewToggle && (
                      <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-0.5 gap-0.5 shrink-0 ml-auto">
                        <button
                          type="button"
                          aria-label={t("cardView")}
                          title={t("cardView")}
                          aria-pressed={viewMode === "cards"}
                          onClick={() => onViewToggle("cards")}
                          className={cn(
                            "inline-flex items-center justify-center rounded-lg p-1.5 text-xs transition-colors",
                            viewMode === "cards"
                              ? "bg-background shadow-xs text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={t("tableView")}
                          title={t("tableView")}
                          aria-pressed={viewMode === "table"}
                          onClick={() => onViewToggle("table")}
                          className={cn(
                            "inline-flex items-center justify-center rounded-lg p-1.5 text-xs transition-colors",
                            viewMode === "table"
                              ? "bg-background shadow-xs text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <List className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Toolbar Extra (e.g. Group by pills/tabs) in its own dedicated row */}
                {toolbarExtra && (
                  <div className="sm:hidden pt-0.5 w-full">
                    {toolbarExtra}
                  </div>
                )}

                {/* Right Section on Desktop: Item Count & View Mode Toggle */}
                <div className="hidden sm:flex items-center justify-end gap-3 shrink-0 ml-auto">
                  {showPaginationSummary &&
                    pagination &&
                    !demoMode &&
                    pagination.total > 0 && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap text-right">
                        <span>
                          {pagination.total} {t("records")} · {t("page")} {pagination.page} {t("of")} {pagination.totalPages}
                        </span>
                      </span>
                    )}

                  {showViewToggle && onViewToggle && (
                    <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-0.5 gap-0.5 shrink-0">
                      <button
                        type="button"
                        aria-label={t("cardView")}
                        title={t("cardView")}
                        aria-pressed={viewMode === "cards"}
                        onClick={() => onViewToggle("cards")}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          viewMode === "cards"
                            ? "bg-background shadow-xs border border-border/50 text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">{t("cardView")}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={t("tableView")}
                        title={t("tableView")}
                        aria-pressed={viewMode === "table"}
                        onClick={() => onViewToggle("table")}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          viewMode === "table"
                            ? "bg-background shadow-xs border border-border/50 text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <List className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">{t("tableView")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2 (Desktop): Dedicated Filter & Grouping Bar */}
              {(hasAnyFilters || toolbarExtra) && (
                <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/50">
                  {/* Filter Groups & Flat Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    {hasFilterGroups &&
                      filterGroups.map((group) => {
                        const variant = resolveVariant(group);
                        return (
                          <div
                            key={group.id}
                            className="flex items-center gap-1.5"
                          >
                            {group.label && variant !== "pills" && (
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                {group.label}:
                              </span>
                            )}
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
                            className="h-8 rounded-full capitalize text-xs px-3.5 whitespace-nowrap transition-all"
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Toolbar Extra (e.g. Group by Kelompok) */}
                  {toolbarExtra && (
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      {hasAnyFilters && (
                        <div className="h-5 w-px bg-border/80 mx-1 shrink-0" />
                      )}
                      {toolbarExtra}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Quick Flat Filters Bar (Scrollable horizontally) */}
              {hasFilters && (
                <div className="flex sm:hidden overflow-x-auto no-scrollbar items-center gap-1.5 py-0.5 -mx-1 px-1">
                  {filters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={
                        activeFilter === filter.value ? "role" : "outline"
                      }
                      size="sm"
                      onClick={() => onFilterChange?.(filter.value)}
                      className="h-7 rounded-full capitalize text-[11px] px-3 shrink-0 whitespace-nowrap"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Active Filter Chips Bar (Both Desktop and Mobile) */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground mr-1">
                    <Filter className="w-3 h-3 text-primary" />
                    <span>{t("active")}</span>
                  </div>

                  {activeFiltersList.map((chip) => (
                    <Badge
                      key={chip.id}
                      variant="secondary"
                      className="gap-1 pr-1.5 pl-2 py-0.5 text-[11px] rounded-lg bg-muted/80 hover:bg-muted font-medium border border-border/60"
                    >
                      <span className="text-muted-foreground">
                        {chip.label}:
                      </span>
                      <span className="font-semibold text-foreground">
                        {chip.valueLabel}
                      </span>
                      <button
                        type="button"
                        onClick={chip.onClear}
                        aria-label={`Hapus filter ${chip.label}`}
                        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetAllFilters}
                    className="h-6 text-[11px] text-muted-foreground hover:text-destructive px-2 ml-auto"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    {t("resetAll")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-over Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent
          side="right"
          className="w-[85vw] max-w-sm flex flex-col p-0 rounded-l-2xl shadow-2xl bg-card border-l border-border/80"
        >
          <SheetHeader className="p-4 border-b border-border/60">
            <SheetTitle className="text-base font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>{t("filterAndSort")}</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {t("filterDesc")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Filter Groups in Mobile Sheet */}
            {hasFilterGroups &&
              filterGroups.map((group) => {
                const variant = resolveVariant(group);
                return (
                  <div key={group.id} className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </label>
                    {variant === "pills" && <FilterPills group={group} />}
                    {variant === "select" && (
                      <FilterSelect group={group} className="w-full" />
                    )}
                    {variant === "dropdown" && (
                      <FilterDropdown group={group} className="w-full" />
                    )}
                    {variant === "combobox" && (
                      <FilterCombobox group={group} className="w-full" />
                    )}
                  </div>
                );
              })}

            {/* Flat filters in Mobile Sheet */}
            {hasFilters && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("category")}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {filters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={
                        activeFilter === filter.value ? "role" : "outline"
                      }
                      size="sm"
                      onClick={() => onFilterChange?.(filter.value)}
                      className="h-8 rounded-full capitalize text-xs px-3.5"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="p-4 border-t border-border/60 flex flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAllFilters}
              className="flex-1 rounded-xl text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              {t("reset")}
            </Button>
            <Button
              type="button"
              variant="role"
              size="sm"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 rounded-xl text-xs font-semibold shadow-xs"
            >
              {t("apply")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Loading State */}
      {isLoading && !demoMode && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-medium">{t("loadingData")}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && !demoMode && (
        <div className="p-4 text-xs font-medium text-destructive text-center border rounded-2xl border-destructive/20 bg-destructive/5 shadow-xs">
          {error}
        </div>
      )}

      {/* Children Custom Rendering vs Cards/Table */}
      {children ? (
        !isBlocked && (
          hasItems ? (
            children
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/50">
              <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                {activeFiltersCount > 0 ? (
                  <SearchX className="w-6 h-6 text-muted-foreground/70" />
                ) : (
                  <Inbox className="w-6 h-6 text-muted-foreground/70" />
                )}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">
                {emptyStateTitle ||
                  (activeFiltersCount > 0
                    ? "Tidak ada data yang cocok"
                    : "Belum ada data tersedia")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                {emptyStateDescription ||
                  (activeFiltersCount > 0
                    ? "Coba sesuaikan kata kunci pencarian atau hapus filter yang sedang aktif."
                    : "Data baru akan otomatis muncul di sini setelah dibuat.")}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetAllFilters}
                  className="rounded-xl text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  {t("resetFiltersAndSearch")}
                </Button>
              )}
            </div>
          )
        )
      ) : (
        <>
          {/* Empty State */}
          {!isBlocked && !hasItems && (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/50">
              <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                {activeFiltersCount > 0 ? (
                  <SearchX className="w-6 h-6 text-muted-foreground/70" />
                ) : (
                  <Inbox className="w-6 h-6 text-muted-foreground/70" />
                )}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">
                {emptyStateTitle ||
                  (activeFiltersCount > 0
                    ? "Tidak ada data yang cocok"
                    : "Belum ada data tersedia")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                {emptyStateDescription ||
                  (activeFiltersCount > 0
                    ? "Coba sesuaikan kata kunci pencarian atau hapus filter yang sedang aktif."
                    : "Data baru akan otomatis muncul di sini setelah dibuat.")}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetAllFilters}
                  className="rounded-xl text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  {t("resetFiltersAndSearch")}
                </Button>
              )}
            </div>
          )}

          {/* Cards View Mode */}
          {!isBlocked && hasItems && viewMode === "cards" && renderCard && (
            <div className={cn("grid gap-4 sm:gap-5", gridColsClass[cardGridCols])}>
              {items.map((item, index) => (
                <div key={resolveKey(item, index)}>{renderCard(item)}</div>
              ))}
            </div>
          )}

          {/* Table View Mode */}
          {!isBlocked &&
            hasItems &&
            viewMode === "table" &&
            renderTableHeaders &&
            renderTableRow && (
              <Card className="border border-border/80 shadow-xs rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">
                        {title}
                      </CardTitle>
                      {description && (
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                          {description}
                        </CardDescription>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground block sm:hidden">
                      {t("scrollHint")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Tabel data ${title}`}
                    className="overflow-x-auto focus:outline-none"
                  >
                    <table
                      aria-label={title}
                      className="w-full text-left text-xs sm:text-sm"
                    >
                      <thead className="text-[11px] uppercase font-semibold text-muted-foreground bg-muted/40 border-b border-border/60">
                        <tr>
                          {renderTableHeaders().map((header, idx) => (
                            <th
                              key={header.key}
                              scope="col"
                              className={cn(
                                "py-3 px-4 font-semibold whitespace-nowrap",
                                header.className,
                              )}
                            >
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {items.map((item, index) => (
                          <tr
                            key={resolveKey(item, index)}
                            className="hover:bg-muted/30 transition-colors"
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

          {/* Fallback Cards if renderCard not provided */}
          {!isBlocked && hasItems && viewMode === "cards" && !renderCard && (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={resolveKey(item, index)}
                  className="p-4 border border-border/70 rounded-xl bg-card hover:border-border transition-colors text-sm"
                >
                  <p className="font-semibold">{String(item)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination Controls */}
      {showPagination &&
        pagination &&
        !demoMode &&
        pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/40">
            <span className="text-xs text-muted-foreground order-2 sm:order-1">
              {t("showing")} {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} {t("of")} {pagination.total} {t("records")}
            </span>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={goToPrev}
                aria-label={t("previousPage")}
                className="h-8 px-2.5 rounded-xl text-xs gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("previous")}</span>
              </Button>

              {/* Direct Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (pagination.totalPages <= 5) return true;
                    if (p === 1 || p === pagination.totalPages) return true;
                    return Math.abs(p - pagination.page) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const hasGap = prevP && p - prevP > 1;
                    return (
                      <React.Fragment key={p}>
                        {hasGap && (
                          <span className="text-xs text-muted-foreground px-1">
                            …
                          </span>
                        )}
                        <Button
                          variant={
                            pagination.page === p ? "role" : "outline"
                          }
                          size="sm"
                          onClick={() => onPageChange?.(p)}
                          aria-current={
                            pagination.page === p ? "page" : undefined
                          }
                          className="h-8 w-8 p-0 rounded-xl text-xs font-semibold"
                        >
                          {p}
                        </Button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={goToNext}
                aria-label={t("nextPage")}
                className="h-8 px-2.5 rounded-xl text-xs gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">{t("next")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
