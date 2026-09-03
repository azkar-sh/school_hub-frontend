import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { SubmissionRow } from "@/lib/mock-data";

interface SubmissionsTableCardProps {
  currentRole?: string;
  submissions: SubmissionRow[];
  isLoading?: boolean;
}

export function SubmissionsTableCard({
  currentRole,
  submissions,
  isLoading,
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
            ? "Enter a submission UUID in the search bar above to view & grade short answers"
            : "All completed and graded assessment attempts"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="p-3.5 text-sm text-muted-foreground">
            Loading submissions…
          </p>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <th className="p-3 font-semibold text-right rounded-r-xl">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3.5 font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          {currentRole === "TEACHER"
                            ? sub.studentName
                            : sub.assessmentTitle}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">
                      {currentRole === "TEACHER"
                        ? sub.assessmentTitle
                        : sub.subject}
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      {sub.submittedAt}
                    </td>
                    <td className="p-3.5">
                      {sub.status === "GRADED" ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/15 text-emerald-600 gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Graded
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-500 border-amber-500/30 gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-base text-foreground">
                      {sub.score !== null ? `${sub.score}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-3.5 text-sm text-muted-foreground">
            No submissions yet. Completed and graded assessment attempts will
            appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
