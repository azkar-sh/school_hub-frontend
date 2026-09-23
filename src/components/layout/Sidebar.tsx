"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import {
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  School,
  ShieldAlert,
  FileSpreadsheet,
  PlusCircle,
  CalendarDays,
  UserRound,
  ClipboardList,
  BarChart3,
  UsersRound,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const t = useTranslations("Common.Sidebar");
  const tNav = useTranslations("Common.Navbar");

  const currentRole = user?.role || activeRole;

  const navItems = [
    {
      label: t("nav.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["TEACHER", "STUDENT", "PARENT", "SCHOOL_ADMIN"],
    },
    {
      label: t("nav.schoolAdminHub"),
      href: "/admin",
      icon: ShieldAlert,
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("nav.school"),
      href: "/school",
      icon: School,
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("nav.academicYears"),
      href: "/academic-years",
      icon: CalendarDays,
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("nav.members"),
      href: "/members",
      icon: UserRound,
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("nav.teachingAssignments"),
      href: "/teaching-assignments",
      icon: ClipboardList,
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("nav.assessments"),
      href: "/assessments",
      icon: FileCheck2,
      roles: ["TEACHER", "STUDENT", "PARENT", "SCHOOL_ADMIN"],
    },
    {
      label: t("nav.submissions"),
      href: "/submissions",
      icon: FileSpreadsheet,
      roles: ["TEACHER", "STUDENT", "PARENT", "SCHOOL_ADMIN"],
    },
    {
      label: t("nav.classes"),
      href: "/classes",
      icon: School,
      roles: ["TEACHER", "PARENT", "SCHOOL_ADMIN"],
    },
    {
      label: t("nav.subjectsTopics"),
      href: "/subjects",
      icon: BookOpen,
      roles: ["TEACHER", "STUDENT", "PARENT", "SCHOOL_ADMIN"],
    },
    {
      label: t("nav.results"),
      href: "/results",
      icon: BarChart3,
      roles: ["TEACHER", "STUDENT", "PARENT"],
    },
    {
      label: t("nav.children"),
      href: "/children",
      icon: UsersRound,
      roles: ["PARENT"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentRole),
  );

  const sidebarContent = (
    <aside className="flex flex-col h-full bg-card/40 backdrop-blur-xl border-r border-border/50 w-64 p-4 gap-6">
      {currentRole === "TEACHER" && (
        <Link href="/assessments/new" onClick={onClose}>
          <Button
            variant="role"
            className="w-full justify-start gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("createAssessment")}</span>
          </Button>
        </Link>
      )}

      <nav className="flex flex-col gap-1.5 flex-1">
        <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {t("navigation")}
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="lg:hidden p-3.5 rounded-2xl bg-muted/50 border border-border/40 text-xs flex flex-col gap-1">
        <div className="font-semibold text-foreground flex items-center justify-between">
          <span>{t("activeRole")}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
            {currentRole}
          </span>
        </div>
        <p className="text-muted-foreground text-[11px]">
          {currentRole === "SCHOOL_ADMIN" && t("descriptions.schoolAdmin")}
          {currentRole === "TEACHER" && t("descriptions.teacher")}
          {currentRole === "STUDENT" && t("descriptions.student")}
          {currentRole === "PARENT" && t("descriptions.parent")}
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-overlay/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-2xl flex flex-col">
<div className="p-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-sm leading-none bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            School<span className="text-primary">Hub</span>
          </span>
          <span className="text-[8px] font-medium text-muted-foreground tracking-wider uppercase">
            {tNav("assessmentSystem")}
          </span>
          {user?.schoolMemberships?.[0]?.school?.name && (
            <span className="text-[11px] font-semibold text-foreground leading-none mt-0.5 max-w-[160px] truncate">
              {user.schoolMemberships[0].school.name}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
