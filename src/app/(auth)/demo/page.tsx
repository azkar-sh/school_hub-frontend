"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { UserRole } from "@/types";
import { useTranslations } from "next-intl";

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
  }> = [
    {
      title: t("teacherTitle"),
      role: "TEACHER",
      detail: t("teacherDescription"),
      icon: BookOpen,
    },
    {
      title: t("studentTitle"),
      role: "STUDENT",
      detail: t("studentDescription"),
      icon: GraduationCap,
    },
    {
      title: t("parentTitle"),
      role: "PARENT",
      detail: t("parentDescription"),
      icon: Users,
    },
  ];

  const handleDemoLogin = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {t("demoTitle")}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            {t("chooseRole")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("demoDataInfo")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map(({ title, role, detail, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{detail}</p>
                <Button
                  variant="role"
                  className="w-full"
                  onClick={() => handleDemoLogin(role)}
                >
                  {t("openDemo")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link
          className="text-sm font-semibold text-primary hover:underline"
          href="/"
        >
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
