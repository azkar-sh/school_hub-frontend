import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { School, AcademicYear } from "@/types";

interface AcademicYearsTabProps {
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  ayName: string;
  onChangeAyName: (value: string) => void;
  ayStartsAt: string;
  onChangeAyStartsAt: (value: string) => void;
  ayEndsAt: string;
  onChangeAyEndsAt: (value: string) => void;
  onCreateAcademicYear: (e: React.FormEvent) => void;
  isLoading: boolean;
  academicYears: AcademicYear[];
}

export function AcademicYearsTab({
  schools,
  selectedSchoolId,
  onSelectSchool,
  ayName,
  onChangeAyName,
  ayStartsAt,
  onChangeAyStartsAt,
  ayEndsAt,
  onChangeAyEndsAt,
  onCreateAcademicYear,
  isLoading,
  academicYears,
}: AcademicYearsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Create Academic Year</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Configure calendar term dates for school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateAcademicYear} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Select School
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                value={selectedSchoolId}
                onChange={(e) => onSelectSchool(e.target.value)}
                required
              >
                <option value="">-- Choose School --</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Academic Year Name
              </label>
              <Input
                placeholder="e.g. 2026/2027"
                value={ayName}
                onChange={(e) => onChangeAyName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                value={ayStartsAt}
                onChange={(e) => onChangeAyStartsAt(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                End Date
              </label>
              <Input
                type="date"
                value={ayEndsAt}
                onChange={(e) => onChangeAyEndsAt(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="role"
              className="w-full"
              isLoading={isLoading}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Save Academic Year
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Academic Terms History</CardTitle>
          <CardDescription className="text-xs">
            Terms configured for target school
          </CardDescription>
        </CardHeader>
        <CardContent>
          {academicYears.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No academic years found for selected school.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {academicYears.map((ay) => (
                <div
                  key={ay.id}
                  className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-foreground">
                      {ay.name}
                    </h4>
                    <Badge variant={ay.isActive ? "role" : "outline"}>
                      {ay.isActive ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Starts: {new Date(ay.startsAt).toLocaleDateString()}</p>
                    <p>Ends: {new Date(ay.endsAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
