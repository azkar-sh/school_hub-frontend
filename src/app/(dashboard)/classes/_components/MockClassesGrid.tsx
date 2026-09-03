import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  School as SchoolIcon,
  Users,
  GraduationCap,
  BookmarkCheck,
} from "lucide-react";
import { MockClass } from "@/lib/mock-data";

interface MockClassesGridProps {
  classes: MockClass[];
  currentRole?: string;
}

export function MockClassesGrid({
  classes,
  currentRole,
}: MockClassesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {classes.map((cls) => (
        <Card
          key={cls.id}
          className={`hover:border-primary/50 transition-all ${
            cls.isCurrentStudentClass ? "border-primary/40 bg-primary/5" : ""
          }`}
        >
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <div>
              {cls.isCurrentStudentClass && (
                <Badge variant="role" className="mb-2 gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  {currentRole === "PARENT" ? "Child's Class" : "Your Class"}
                </Badge>
              )}
              {!cls.isCurrentStudentClass && (
                <Badge variant="role" className="mb-2">
                  Grade {cls.grade}
                </Badge>
              )}
              <CardTitle className="text-xl">{cls.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Academic Year: {cls.academicYear}
              </CardDescription>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <SchoolIcon className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-sm border-t border-border/40 mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Homeroom: {cls.homeroomTeacher}
              </span>
              <span className="flex items-center gap-1 font-bold text-foreground">
                <Users className="w-4 h-4 text-indigo-500" />
                {cls.studentsCount} Students
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
