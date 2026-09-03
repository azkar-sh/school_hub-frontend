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
import { UserPlus } from "lucide-react";
import { School, User, SchoolMember } from "@/types";

interface MembersTabProps {
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  usersList: User[];
  memberUserId: string;
  onChangeMemberUserId: (value: string) => void;
  onAddMember: (e: React.FormEvent) => void;
  isLoading: boolean;
  schoolMembers: SchoolMember[];
}

export function MembersTab({
  schools,
  selectedSchoolId,
  onSelectSchool,
  usersList,
  memberUserId,
  onChangeMemberUserId,
  onAddMember,
  isLoading,
  schoolMembers,
}: MembersTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <span>Add School Member</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Associate a registered user with a school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onAddMember} className="space-y-4">
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
                Select User or Enter User ID
              </label>
              {usersList.length > 0 ? (
                <select
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                  value={memberUserId}
                  onChange={(e) => onChangeMemberUserId(e.target.value)}
                  required
                >
                  <option value="">-- Select User --</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role}) - {u.email}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder="Paste User UUID"
                  value={memberUserId}
                  onChange={(e) => onChangeMemberUserId(e.target.value)}
                  required
                />
              )}
            </div>

            <Button
              type="submit"
              variant="role"
              className="w-full"
              isLoading={isLoading}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add to School
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">School Roster & Members</CardTitle>
          <CardDescription className="text-xs">
            All affiliated teachers, students, and staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schoolMembers.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No registered members found for this school yet.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {schoolMembers.map((m) => (
                <div
                  key={m.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground">
                      {m.user?.name || "User"}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({m.user?.email || m.userId})
                    </span>
                  </div>
                  <Badge variant="outline">{m.user?.role || "MEMBER"}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
