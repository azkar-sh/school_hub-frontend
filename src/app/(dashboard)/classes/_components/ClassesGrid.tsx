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
  Loader2,
  School as SchoolIcon,
  Users,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { Class } from "@/types";

interface ClassesGridProps {
  isLoading: boolean;
  classes: Class[];
  selectedAyId: string;
  canManageClasses: boolean;
  onEnrollStudent: (classId: string) => void;
  onAssignHomeroom: (classId: string) => void;
}

export function ClassesGrid({
  isLoading,
  classes,
  selectedAyId,
  canManageClasses,
  onEnrollStudent,
  onAssignHomeroom,
}: ClassesGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading classes…</span>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="py-12 text-center text-muted-foreground text-sm">
        No classes created for this school yet.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {classes.map((cls) => {
        const homeroom =
          cls.homeroomAssignments?.[0]?.teacher?.name || "Unassigned";
        const enrollmentsCount = cls.enrollments?.length || 0;

        return (
          <Card key={cls.id} className="hover:border-primary/50 transition-all">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <Badge variant="role" className="mb-2">
                  Grade {cls.grade}
                </Badge>
                <CardTitle className="text-xl">{cls.name}</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Academic Year: {cls.academicYear?.name || selectedAyId}
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
                  Homeroom: {homeroom}
                </span>
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {enrollmentsCount} Enrolled
                </span>
              </div>

              {canManageClasses && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 flex-1"
                    onClick={() => onEnrollStudent(cls.id)}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Enroll Student
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 flex-1"
                    onClick={() => onAssignHomeroom(cls.id)}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Assign Homeroom
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
