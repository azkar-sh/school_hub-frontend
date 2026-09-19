import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileCheck2, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Dashboard.welcomeBanner");
  return (
    <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden gradient-role text-primary-foreground shadow-xl">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 capitalize"
            >
              {t("roleMode", { role: currentRole.toLowerCase() })}
            </Badge>
            <span className="text-xs text-primary-foreground/80 font-medium">
              • {isDemoMode ? t("demoPreview") : t("academicTerm")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {userName ? t("hello", { name: userName }) : t("helloFallback")}
          </h1>
          <p className="text-sm text-primary-foreground/90 max-w-xl">
            {currentRole === "SCHOOL_ADMIN" && t("descAdmin")}
            {currentRole === "TEACHER" && t("descTeacher")}
            {currentRole === "STUDENT" && t("descStudent")}
            {currentRole === "PARENT" && t("descParent")}
          </p>
        </div>

        {currentRole === "TEACHER" && (
          <Link href="/assessments/new">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg font-bold border-none"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {t("newAssessment")}
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
              {t("startQuiz")}
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
              {t("manageYears")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
