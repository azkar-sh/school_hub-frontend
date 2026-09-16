import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileCheck2, CalendarDays } from "lucide-react";

interface WelcomeBannerProps {
  currentRole: string;
  isDemoMode: boolean;
  userName?: string;
}

export function WelcomeBanner({
  currentRole,
  isDemoMode,
  userName,
}: WelcomeBannerProps) {
  return (
    <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden gradient-role text-primary-foreground shadow-xl">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 capitalize"
            >
              {currentRole.toLowerCase()} Mode
            </Badge>
            <span className="text-xs text-primary-foreground/80 font-medium">
              • {isDemoMode ? "Demo Preview" : "Academic Term 2026"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {userName || "Welcome Back"}! 👋
          </h1>
          <p className="text-sm text-primary-foreground/90 max-w-xl">
            {currentRole === "SCHOOL_ADMIN" &&
              "Manage your school, academic years, classes, members, and teaching assignments."}
            {currentRole === "TEACHER" &&
              "Manage your curriculum assessments, grade student submissions, and review topic coverage."}
            {currentRole === "STUDENT" &&
              "View your pending assessments, practice quizzes, and track your overall grade averages."}
            {currentRole === "PARENT" &&
              "Monitor your child's academic progress, review quiz scores, and track homework submission."}
          </p>
        </div>

        {currentRole === "TEACHER" && (
          <Link href="/assessments/new">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg font-bold border-none"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              New Assessment
            </Button>
          </Link>
        )}

        {currentRole === "STUDENT" && (
          <Link href="/assessments">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg font-bold border-none"
            >
              <FileCheck2 className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </Link>
        )}

        {currentRole === "SCHOOL_ADMIN" && (
          <Link href="/academic-years">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg font-bold border-none"
            >
              <CalendarDays className="w-5 h-5 mr-2" />
              Manage Years
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
