"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { useSchoolContextStore } from "@/stores/use-school-context-store";
import { RoleThemeSwitcher } from "./RoleThemeSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  GraduationCap,
  LogOut,
  Menu,
  User as UserIcon,
  School as SchoolIcon,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export function Navbar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const router = useRouter();
  const { user, logout, isAuthenticated, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const { userSchools, activeSchoolId, setActiveSchool } =
    useSchoolContextStore();

  const currentRole = user?.role || activeRole;
  const showSchoolSwitcher =
    isAuthenticated && !isDemoMode && userSchools.length > 1;
  const t = useTranslations("Common.Navbar");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
              aria-label={t("openNavigation")}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base sm:text-lg leading-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent hidden lg:inline">
                School<span className="text-primary">Hub</span>
                <span className="hidden lg:inline">
                  {" "}
                  |{" "}
                  {user?.role !== "SCHOOL_ADMIN" &&
                    user?.schoolMemberships?.[0]?.school?.name}
                </span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                {t("assessmentSystem")}
              </span>
            </div>
          </Link>
          {/* <Badge
            role={currentRole}
            className="ml-2 hidden md:inline-flex capitalize"
          >
            {currentRole.toLowerCase()} portal
          </Badge> */}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <RoleThemeSwitcher className="hidden md:flex" />
          <LanguageSwitcher />
          <ThemeToggle />

          {showSchoolSwitcher && (
            <div className="hidden sm:flex items-center gap-1.5 h-9 px-2 rounded-xl border border-border/60 bg-muted/40">
              <SchoolIcon className="w-4 h-4 text-primary shrink-0" />
              <select
                value={activeSchoolId}
                onChange={(e) => setActiveSchool(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none max-w-[140px] truncate cursor-pointer"
                title={t("switchSchool")}
              >
                {userSchools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {isAuthenticated && user && !isDemoMode ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-border/60 shrink-0">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold leading-none max-w-[160px] truncate">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate">
                  {user.email}
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground font-semibold border border-border">
                {user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title={t("logout")}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="role" size="sm">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
