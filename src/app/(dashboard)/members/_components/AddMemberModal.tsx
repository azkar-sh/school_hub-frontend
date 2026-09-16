import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { User } from "@/types";

interface AddMemberModalProps {
  isDemoMode: boolean;
  usersList: User[];
  memberUserId: string;
  onChangeMemberUserId: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddMemberModal({
  isDemoMode,
  usersList,
  memberUserId,
  onChangeMemberUserId,
  onClose,
  onSubmit,
}: AddMemberModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 backdrop-blur-xs p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Add School Member</CardTitle>
          <button onClick={onClose} className="text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
                  placeholder={isDemoMode ? "User UUID" : "Paste User UUID"}
                  value={memberUserId}
                  onChange={(e) => onChangeMemberUserId(e.target.value)}
                  required
                />
              )}
            </div>
            <Button type="submit" variant="role" className="w-full">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add to School
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
