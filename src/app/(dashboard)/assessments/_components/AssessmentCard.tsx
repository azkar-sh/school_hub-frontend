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
import {
  Clock,
  CheckCircle2,
  BookOpen,
  BarChart3,
  PencilLine,
} from "lucide-react";
import { MockAssessment } from "@/lib/mock-data";

function StatusBadge({
  currentRole,
  item,
}: {
  currentRole: string;
  item: MockAssessment;
}) {
  if (currentRole === "TEACHER") {
    return (
      item.submissionsCount !== undefined && (
        <Badge
          variant="secondary"
          className="bg-success/10 text-success gap-1"
        >
          <BarChart3 className="w-3 h-3" />
          <span>{item.submissionsCount} submissions</span>
        </Badge>
      )
    );
  }

  if (item.status === "SUBMITTED" || item.status === "GRADED") {
    return (
      <Badge
        variant="secondary"
        className="bg-success/15 text-success gap-1"
      >
        <CheckCircle2 className="w-3 h-3" />
        <span>{item.status === "GRADED" ? "Graded" : "Submitted"}</span>
      </Badge>
    );
  }

  if (item.status === "DRAFT") {
    return (
      <Badge
        variant="outline"
        className="text-primary border-primary/30 gap-1"
      >
        <PencilLine className="w-3 h-3" />
        <span>In Progress</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-warning border-warning/30 gap-1"
    >
      <Clock className="w-3 h-3" />
      <span>Active</span>
    </Badge>
  );
}

interface AssessmentCardProps {
  currentRole: string;
  item: MockAssessment;
  actionLabel: (item: MockAssessment) => string;
}

export function AssessmentCard({
  currentRole,
  item,
  actionLabel,
}: AssessmentCardProps) {
  return (
    <Card className="relative flex flex-col justify-between hover:border-primary/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase">
              {item.type}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {item.subject}
            </span>
          </div>

          <StatusBadge currentRole={currentRole} item={item} />
        </div>

        <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
        <CardDescription className="text-xs mt-1">
          Due: {item.due}
          {item.questionsCount > 0 && ` • ${item.questionsCount} Questions`}
          {item.points > 0 && ` • ${item.points} Points`}
          {currentRole === "TEACHER" && item.avgScore !== undefined && (
            <span className="text-success font-semibold">
              {" "}
              • Avg: {item.avgScore}%
            </span>
          )}
          {currentRole !== "TEACHER" &&
            item.score !== undefined &&
            item.status !== "DRAFT" && (
              <span className="text-success font-semibold">
                {" "}
                • Score: {item.score} pts
              </span>
            )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex items-center justify-between border-t border-border/40 pt-4 mt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>Auto-Graded MCQ</span>
        </div>
        <Link href={`/assessments/${item.id}`}>
          <Button variant="role" size="sm">
            {actionLabel(item)}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
