import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface AssessmentsHeaderProps {
  currentRole: string;
}

export function AssessmentsHeader({ currentRole }: AssessmentsHeaderProps) {
  const t = useTranslations("Assessments");
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {currentRole === "TEACHER"
            ? t("pageTitleTeacher")
            : t("pageTitleDefault")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentRole === "TEACHER"
            ? t("pageDescTeacher")
            : currentRole === "PARENT"
              ? t("pageDescParent")
              : t("pageDescStudent")}
        </p>
      </div>

      {currentRole === "TEACHER" && (
        <Link href="/assessments/new">
          <Button variant="role" className="shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("createAssessment")}
          </Button>
        </Link>
      )}
    </div>
  );
}
