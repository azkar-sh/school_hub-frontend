import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AssessmentsHeaderProps {
  currentRole: string;
}

export function AssessmentsHeader({ currentRole }: AssessmentsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {currentRole === "TEACHER"
            ? "My Assessments"
            : "Assessments & Quizzes"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentRole === "TEACHER"
            ? "Manage and publish your assessments, quizzes, and exams"
            : currentRole === "PARENT"
              ? "Browse your child's assessment results and upcoming tests"
              : "Browse, practice, or start your class assessments"}
        </p>
      </div>

      {currentRole === "TEACHER" && (
        <Link href="/assessments/new">
          <Button variant="role" className="shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Assessment
          </Button>
        </Link>
      )}
    </div>
  );
}
