import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardVariant = "default" | "warning" | "success" | "destructive";
export type StatCardColor = "default" | "primary" | "warning" | "success" | "destructive";

export interface StatCardBadge {
  text: string;
  variant?: "default" | "primary" | "warning" | "success" | "destructive";
}

export interface StatCardProps {
  /** Upper category title/label (e.g. "MY CLASSES", "QUIZZES TAKEN") */
  title: string;
  /** Primary metric value (number, string, or JSX) */
  value: React.ReactNode;
  /** Lucide icon shown in the modern icon pill */
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Explanatory description below the metric value */
  subtitle?: React.ReactNode;
  /** Optional icon prefix for subtitle (e.g. <TrendingUp />) */
  subtitleIcon?: React.ReactNode;
  /** Optional status pill badge shown next to title or subtitle */
  badge?: StatCardBadge | string;
  /** Navigation target. Renders card as interactive Link with hover lift and arrow button */
  href?: string;
  /** Click callback if not navigating */
  onClick?: () => void;
  /** When true, renders an animated loader in place of value */
  isLoading?: boolean;
  /** Card container style variant */
  variant?: StatCardVariant;
  /** Color override for metric value */
  valueColor?: StatCardColor;
  /** Color override for icon badge */
  iconColor?: StatCardColor;
  /** Explicit control over showing action arrow */
  showArrow?: boolean;
  /** Additional container classes */
  className?: string;
}

const containerVariants: Record<StatCardVariant, string> = {
  default:
    "border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.04] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
  warning:
    "border-warning/40 bg-gradient-to-br from-card via-card to-warning/[0.07] hover:border-warning/70 ring-1 ring-warning/20 hover:shadow-lg hover:shadow-warning/10",
  success:
    "border-success/30 bg-gradient-to-br from-card via-card to-success/[0.05] hover:border-success/60 hover:shadow-lg hover:shadow-success/10",
  destructive:
    "border-destructive/30 bg-gradient-to-br from-card via-card to-destructive/[0.05] hover:border-destructive/60 hover:shadow-lg hover:shadow-destructive/10",
};

const ambientGlowVariants: Record<StatCardVariant, string> = {
  default: "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-125",
  warning: "bg-warning/15 group-hover:bg-warning/25 group-hover:scale-125",
  success: "bg-success/15 group-hover:bg-success/25 group-hover:scale-125",
  destructive: "bg-destructive/15 group-hover:bg-destructive/25 group-hover:scale-125",
};

const topAccentLineVariants: Record<StatCardVariant, string> = {
  default: "bg-gradient-to-r from-transparent via-primary/70 to-transparent",
  warning: "bg-gradient-to-r from-transparent via-warning to-transparent",
  success: "bg-gradient-to-r from-transparent via-success to-transparent",
  destructive: "bg-gradient-to-r from-transparent via-destructive to-transparent",
};

const titleColorMap: Record<StatCardVariant, string> = {
  default: "text-muted-foreground/90 group-hover:text-primary transition-colors",
  warning: "text-warning",
  success: "text-success",
  destructive: "text-destructive",
};

const iconBadgeVariants: Record<StatCardColor, string> = {
  default: "bg-muted text-muted-foreground border-border/60",
  primary:
    "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary shadow-xs",
  warning:
    "bg-warning/15 text-warning border-warning/30 group-hover:bg-warning group-hover:text-warning-foreground group-hover:border-warning shadow-xs",
  success:
    "bg-success/15 text-success border-success/30 group-hover:bg-success group-hover:text-success-foreground group-hover:border-success shadow-xs",
  destructive:
    "bg-destructive/15 text-destructive border-destructive/30 group-hover:bg-destructive group-hover:text-destructive-foreground group-hover:border-destructive shadow-xs",
};

const valueColorMap: Record<StatCardColor, string> = {
  default: "text-foreground",
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  destructive: "text-destructive",
};

const badgeVariantStyles: Record<string, string> = {
  default: "bg-muted/70 text-muted-foreground border-border/60",
  primary: "bg-primary/10 text-primary border-primary/25",
  warning: "bg-warning/15 text-warning border-warning/30",
  success: "bg-success/15 text-success border-success/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  subtitleIcon,
  badge,
  href,
  onClick,
  isLoading = false,
  variant = "default",
  valueColor,
  iconColor,
  showArrow,
  className,
}: StatCardProps) {
  const isInteractive = Boolean(href || onClick);
  const shouldShowArrow = showArrow ?? isInteractive;

  const resolvedIconColor: StatCardColor =
    iconColor ?? (variant === "default" ? "primary" : variant);

  const resolvedValueColor: StatCardColor =
    valueColor ?? (variant === "default" ? "default" : variant);

  const parsedBadge: StatCardBadge | null =
    typeof badge === "string"
      ? { text: badge, variant: variant === "default" ? "primary" : variant }
      : badge ?? null;

  const cardInner = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-300",
        containerVariants[variant],
        isInteractive && "group-hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {/* Top subtle ambient glowing radial light in top-right corner */}
      <div
        className={cn(
          "absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500",
          ambientGlowVariants[variant]
        )}
      />

      {/* Top illuminated accent line that fades in on hover */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          topAccentLineVariants[variant]
        )}
      />

      {/* Header Row: Title + Pill Badge + Icon Squircle */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate",
              titleColorMap[variant]
            )}
          >
            {title}
          </span>
          {parsedBadge && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                badgeVariantStyles[parsedBadge.variant ?? "primary"]
              )}
            >
              {parsedBadge.text}
            </span>
          )}
        </div>

        {/* Modern Icon Badge */}
        <div
          className={cn(
            "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shrink-0",
            iconBadgeVariants[resolvedIconColor]
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Middle Row: Hero Metric Value + Interactive Quick-action Arrow */}
      <div className="relative z-10 flex items-baseline justify-between gap-2 my-1">
        <div
          className={cn(
            "text-3xl sm:text-4xl font-black tracking-tight",
            valueColorMap[resolvedValueColor]
          )}
        >
          {isLoading ? (
            <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
          ) : (
            value
          )}
        </div>

        {shouldShowArrow && (
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0",
              "bg-background/80 border-border/50 text-muted-foreground shadow-xs",
              "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Bottom Row: Contextual Subtitle / Trend / Status Note */}
      {subtitle !== undefined && subtitle !== null && (
        <div className="relative z-10 text-[11px] sm:text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40 truncate flex items-center gap-1.5">
          {subtitleIcon}
          <span className="truncate">{subtitle}</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group h-full focus:outline-none">
        {cardInner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left group h-full focus:outline-none"
      >
        {cardInner}
      </button>
    );
  }

  return <div className="group h-full">{cardInner}</div>;
}
