"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { UserRole } from "@/types";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function DemoPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const t = useTranslations("DemoPage");

  const roles: Array<{
    title: string;
    role: UserRole;
    detail: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderHover: string;
  }> = [
    {
      title: t("studentTitle"),
      role: "STUDENT",
      detail: t("studentDescription"),
      icon: GraduationCap,
      accentColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
      borderHover: "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
    },
    {
      title: t("teacherTitle"),
      role: "TEACHER",
      detail: t("teacherDescription"),
      icon: BookOpen,
      accentColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
    },
    {
      title: t("parentTitle"),
      role: "PARENT",
      detail: t("parentDescription"),
      icon: Users,
      accentColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/5",
    },
    {
      title: t("adminTitle"),
      role: "SCHOOL_ADMIN",
      detail: t("adminDescription"),
      icon: ShieldAlert,
      accentColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      borderHover: "hover:border-purple-500/40 hover:shadow-purple-500/5",
    },
  ];

  const handleDemoLogin = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 relative">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-xl hover:bg-muted/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("backHome")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {t("demoTitle")}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t("chooseRole")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("demoDataInfo")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ title, role, detail, icon: Icon, accentColor, borderHover }) => (
            <Card key={title} className={`transition-all duration-200 border-border/70 ${borderHover}`}>
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground min-h-[3rem] leading-relaxed">{detail}</p>
                <Button
                  variant="outline"
                  className="w-full font-semibold group cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  onClick={() => handleDemoLogin(role)}
                >
                  {t("openDemo")}{" "}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
