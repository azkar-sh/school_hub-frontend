"use client";

import * as React from "react";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { UserRole } from "@/types";
import { GraduationCap, BookOpen, Users, Sparkles, Lock } from "lucide-react";
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
  }> = [
    {
      id: "STUDENT",
      label: "Student",
      icon: GraduationCap,
      colorClass:
        "hover:text-indigo-500 data-[active=true]:bg-indigo-500 data-[active=true]:text-white",
    },
    {
      id: "TEACHER",
      label: "Teacher",
      icon: BookOpen,
      colorClass:
        "hover:text-emerald-500 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
    },
    {
      id: "PARENT",
      label: "Parent",
      icon: Users,
      colorClass:
        "hover:text-amber-500 data-[active=true]:bg-amber-500 data-[active=true]:text-white",
    },
  ];

  // For real authenticated users, show a locked role indicator instead of the switcher
  if (!isDemoMode && user) {
    const currentRoleConfig = roles.find((r) => r.id === user.role);
    const Icon = currentRoleConfig?.icon ?? GraduationCap;
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-muted/60 px-3 py-2 rounded-2xl border border-border/50 shadow-inner text-xs text-muted-foreground",
          className,
        )}
        title="Role is determined by your account"
      >
        <Lock className="w-3 h-3 shrink-0" />
        <Icon className="w-3.5 h-3.5" />
        <span className="font-semibold capitalize">
          {user.role.toLowerCase()} Role
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
