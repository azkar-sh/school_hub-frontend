import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { SubmissionRow } from "@/lib/mock-data";

interface SubmissionsTableCardProps {
  currentRole?: string;
  submissions: SubmissionRow[];
}

export function SubmissionsTableCard({
  currentRole,
  submissions,
}: SubmissionsTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          <span>
            {currentRole === "TEACHER"
              ? "Recent Submissions Overview"
              : currentRole === "PARENT"
                ? "Child Wards' Submissions"
                : "Your Submissions"}
          </span>
        </CardTitle>
        <CardDescription>
          {currentRole === "TEACHER"
            ? "Click any submission to review answers and grade short-answer questions"
            : "Click any submission to review your answers and scores"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground bg-muted/50 rounded-xl">
                  <tr>
                    <th className="p-3 font-semibold rounded-l-xl">
                      {currentRole === "TEACHER" ? "Student" : "Assessment"}
                    </th>
                    <th className="p-3 font-semibold">
                      {currentRole === "TEACHER" ? "Assessment Title" : "Subject"}
                    </th>
                    <th className="p-3 font-semibold">Submitted At</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Score</th>
                    <th className="p-3 font-semibold rounded-r-xl w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="p-3.5 font-medium">
                        <Link
                          href={`/submissions/${sub.id}`}
                          className="flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            {currentRole === "TEACHER"
                              ? sub.studentName
                              : sub.assessmentTitle}
                          </span>
                        </Link>
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        <Link href={`/submissions/${sub.id}`}>
                          {currentRole === "TEACHER"
                            ? sub.assessmentTitle
                            : sub.subject}
                        </Link>
                      </td>
                      <td className="p-3.5 text-xs text-muted-foreground">
                        <Link href={`/submissions/${sub.id}`}>
                          {sub.submittedAt}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <Link href={`/submissions/${sub.id}`}>
                          {sub.status === "GRADED" ? (
                            <Badge
                              variant="secondary"
                              className="bg-success/15 text-success gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Graded
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-warning border-warning/30 gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </Badge>
                          )}
                        </Link>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-base text-foreground">
                        <Link href={`/submissions/${sub.id}`}>
                          {sub.score !== null ? `${sub.score}%` : "—"}
                        </Link>
                      </td>
                      <td className="p-3.5 w-8">
                        <Link
                          href={`/submissions/${sub.id}`}
                          className="flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (< md) */}
            <div className="md:hidden space-y-3">
              {submissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/submissions/${sub.id}`}
                  className="block p-4 rounded-xl bg-card border border-border/60 hover:border-primary/50 transition-all space-y-2.5 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {currentRole === "TEACHER"
                          ? sub.studentName
                          : sub.assessmentTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {currentRole === "TEACHER"
                          ? sub.assessmentTitle
                          : sub.subject}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-foreground">
                        {sub.score !== null ? `${sub.score}%` : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      {sub.submittedAt}
                    </span>
                    <div className="flex items-center gap-1">
                      {sub.status === "GRADED" ? (
                        <Badge
                          variant="secondary"
                          className="bg-success/15 text-success text-[10px] gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Graded
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-warning border-warning/30 text-[10px] gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </Badge>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="p-3.5 text-sm text-muted-foreground text-center py-8">
            No submissions match your search or filter.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

