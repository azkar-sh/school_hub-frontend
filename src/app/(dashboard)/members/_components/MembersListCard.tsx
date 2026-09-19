import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound, Mail } from "lucide-react";
import { MockMember } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

interface MembersListCardProps {
  members: MockMember[];
  onSelectMember: (member: MockMember) => void;
}

export function MembersListCard({
  members,
  onSelectMember,
}: MembersListCardProps) {
  const t = useTranslations("Members");

  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-base">
          {t("membersCount", { count: members.length })}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("allAffiliated")}
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/50 p-0">
        {members.length === 0 ? (
          <div className="py-14 text-center text-sm text-muted-foreground">
            {t("noMembersMatch")}
          </div>
        ) : (
          members.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMember(m)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <UserRound className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-sm text-foreground">
                    {m.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {m.email}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize text-xs">
                {m.role.toLowerCase().replace("_", " ")}
              </Badge>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
