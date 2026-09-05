"use client";

import * as React from "react";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { UserRole } from "@/types";
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldAlert,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleThemeSwitcher({ className }: { className?: string }) {
  const { activeRole, setRoleTheme } = useRoleThemeStore();
  const { demoLoginAs, user, isDemoMode } = useAuthStore();

  const handleSwitch = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
  };

  const roles: Array<{
    id: UserRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    lockedClass: string;
  }> = [
    {
      id: "STUDENT",
      label: "Student",
      icon: GraduationCap,
      colorClass:
        "hover:text-indigo-500 data-[active=true]:bg-indigo-500 data-[active=true]:text-white",
      lockedClass:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      id: "TEACHER",
      label: "Teacher",
      icon: BookOpen,
      colorClass:
        "hover:text-emerald-500 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
      lockedClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      id: "PARENT",
      label: "Parent",
      icon: Users,
      colorClass:
        "hover:text-amber-500 data-[active=true]:bg-amber-500 data-[active=true]:text-white",
      lockedClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: "SCHOOL_ADMIN",
      label: "Admin",
      icon: ShieldAlert,
      colorClass:
        "hover:text-purple-500 data-[active=true]:bg-purple-600 data-[active=true]:text-white",
      lockedClass:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  ];

  // For real authenticated users, show a locked role indicator instead of the switcher
  if (!isDemoMode && user) {
    const currentRoleConfig = roles.find((r) => r.id === user.role);
    const Icon = currentRoleConfig?.icon ?? GraduationCap;
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-inner text-xs md:hidden",
          currentRoleConfig?.lockedClass ??
            "bg-muted/60 text-muted-foreground border-border/50",
          className,
        )}
        title="Role is determined by your account"
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="font-semibold capitalize">
          {user.role.toLowerCase()} Portal
        </span>
      </div>
    );
  }

  // Demo mode: show the full role switcher
  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-muted/60 p-1.5 rounded-2xl border border-border/50 shadow-inner",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-muted-foreground sm:flex">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>Preview Role:</span>
      </div>
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = activeRole === r.id || user?.role === r.id;

        return (
          <button
            key={r.id}
            data-active={isActive}
            onClick={() => handleSwitch(r.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200",
              "text-muted-foreground hover:bg-background/80",
              r.colorClass,
              isActive && "shadow-sm font-semibold",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="block md:hidden">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
