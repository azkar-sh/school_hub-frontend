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
import { Building2, Plus } from "lucide-react";
import { School } from "@/types";

interface SchoolsTabProps {
  schoolName: string;
  onChangeSchoolName: (value: string) => void;
  onCreateSchool: (e: React.FormEvent) => void;
  isLoading: boolean;
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
}

export function SchoolsTab({
  schoolName,
  onChangeSchoolName,
  onCreateSchool,
  isLoading,
  schools,
  selectedSchoolId,
  onSelectSchool,
}: SchoolsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Add New School</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Create an institution profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateSchool} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                School Name
              </label>
              <Input
                placeholder="e.g. SMA Garuda Hope"
                value={schoolName}
                onChange={(e) => onChangeSchoolName(e.target.value)}
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
              Create School
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Registered Schools</CardTitle>
          <CardDescription className="text-xs">
            Select a school to configure academic terms and members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schools.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No schools created yet. Use the form on the left to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {schools.map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => onSelectSchool(sch.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedSchoolId === sch.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/60 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {sch.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        ID: {sch.id}
                      </p>
                    </div>
                  </div>
                  {selectedSchoolId === sch.id && (
                    <Badge variant="role" className="text-[10px]">
                      Active Context
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
