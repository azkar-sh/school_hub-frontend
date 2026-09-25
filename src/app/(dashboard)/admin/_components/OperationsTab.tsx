import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  GraduationCap,
  ClipboardList,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface OperationsTabProps {
  memberCount: number;
  classCount: number;
  subjectCount: number;
  activeAcademicYear: string;
}

export function OperationsTab({
  memberCount,
  classCount,
  subjectCount,
  activeAcademicYear,
}: OperationsTabProps) {
  const operationsModules = [
    {
      title: "Academic Years & Sessions",
      description:
        "Define operational school terms, start/end dates, and manage active session rollover.",
      icon: Calendar,
      badgeText: activeAcademicYear,
      badgeColor: "emerald",
      statValue: "Active Session",
      actionText: "Manage Terms",
      href: "/academic-years",
    },
    {
      title: "Class Sections & Homerooms",
      description:
        "Manage cohorts, student classroom enrollments, and assign Wali Kelas (homeroom educators).",
      icon: GraduationCap,
      badgeText: `${classCount} Sections`,
      badgeColor: "blue",
      statValue: "Cohorts Configured",
      actionText: "Manage Classes",
      href: "/classes",
    },
    {
      title: "Teaching Assignments",
      description:
        "Allocate subject-certified teachers to classes and sections across academic terms.",
      icon: ClipboardList,
      badgeText: "Subject Allocation",
      badgeColor: "purple",
      statValue: "Curriculum Delivery",
      actionText: "Manage Assignments",
      href: "/teaching-assignments",
    },
    {
      title: "School Community Directory",
      description:
        "Provision and oversee teacher, student, and parent user memberships affiliated with this school.",
      icon: Users,
      badgeText: `${memberCount} Affiliates`,
      badgeColor: "primary",
      statValue: "Total Members",
      actionText: "Open Directory",
      href: "/members",
    },
    {
      title: "Master Subject Catalog",
      description:
        "Register official academic courses and review teacher-authored syllabus topics.",
      icon: BookOpen,
      badgeText: `${subjectCount} Subjects`,
      badgeColor: "amber",
      statValue: "Curricula Registry",
      actionText: "Review Subjects",
      href: "/subjects",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Administrative Operations Checklist
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational status across all institutional governance modules.
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-xs px-2.5 py-0.5 gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {operationsModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card
              key={mod.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {mod.badgeText}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground mt-3">
                  {mod.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {mod.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {mod.statValue}
                  </span>
                  <Link href={mod.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform p-0 h-auto"
                    >
                      <span>{mod.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
