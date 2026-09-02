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

const roles: Array<{
  title: string;
  role: UserRole;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    title: "Teacher",
    role: "TEACHER",
    detail: "Curriculum, assessments, submissions, and results.",
    icon: BookOpen,
  },
  {
    title: "Student",
    role: "STUDENT",
    detail: "Upcoming assessments, attempts, and scores.",
    icon: GraduationCap,
  },
  {
    title: "Parent",
    role: "PARENT",
    detail: "Children and assessment progress.",
    icon: Users,
  },
];

export default function DemoPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();

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
            Learn Hub Demo
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            Choose a role to explore
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every preview uses the same seeded Garuda Hope school data.
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
                  Open demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link
          className="text-sm font-semibold text-primary hover:underline"
          href="/"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
