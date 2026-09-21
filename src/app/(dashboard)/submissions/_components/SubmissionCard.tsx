import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, User, BookOpen, Calendar } from "lucide-react";
import { SubmissionRow } from "@/lib/mock-data";

interface SubmissionCardProps {
  currentRole: string;
  item: SubmissionRow;
}

export function SubmissionCard({ currentRole, item }: SubmissionCardProps) {
  const isTeacher = currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN";
  return (
    <Card className="relative flex flex-col justify-between hover:border-primary/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] uppercase">
            {item.subject}
          </Badge>
          {item.status === "GRADED" ? (
            <Badge
              variant="secondary"
              className="bg-success/15 text-success gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Graded</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-warning border-warning/30 gap-1"
            >
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </Badge>
          )}
        </div>

        <CardTitle className="text-lg leading-snug">
          {isTeacher ? item.studentName : item.assessmentTitle}
        </CardTitle>
        <CardDescription className="text-xs mt-1">
          {isTeacher ? item.assessmentTitle : item.subject}
          {item.score !== null && (
            <span className="text-success font-semibold">
              {" "}
              • Score: {item.score}%
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex items-center justify-between border-t border-border/40 pt-4 mt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{item.submittedAt}</span>
        </div>
        <Link href={`/submissions/${item.id}`}>
          <Button variant="role" size="sm">
            {isTeacher
              ? item.status === "SUBMITTED"
                ? "Grade"
                : "View"
              : "View Result"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
