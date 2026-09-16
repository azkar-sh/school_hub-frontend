import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound, Mail, X, School as SchoolIcon } from "lucide-react";
import { MockMember } from "@/lib/mock-data";

interface MemberDetailModalProps {
  member: MockMember;
  onClose: () => void;
}

export function MemberDetailModal({ member, onClose }: MemberDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 backdrop-blur-xs p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Member Detail</CardTitle>
          <button onClick={onClose} className="text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <UserRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {member.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {member.email}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Role
            </p>
            <Badge variant="role" className="capitalize">
              {member.role.toLowerCase().replace("_", " ")}
            </Badge>
          </div>

          {/* School Membership */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              School Membership
            </p>
            <div className="flex items-center gap-2 text-sm">
              <SchoolIcon className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                {member.schoolName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
