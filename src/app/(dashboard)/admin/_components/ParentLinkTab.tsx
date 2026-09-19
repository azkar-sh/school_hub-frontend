import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { User, ParentRelationship } from "@/types";

interface ParentLinkTabProps {
  usersList: User[];
  linkParentId: string;
  onChangeLinkParentId: (value: string) => void;
  linkStudentId: string;
  onChangeLinkStudentId: (value: string) => void;
  linkRelationship: ParentRelationship;
  onChangeLinkRelationship: (value: ParentRelationship) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ParentLinkTab({
  usersList,
  linkParentId,
  onChangeLinkParentId,
  linkStudentId,
  onChangeLinkStudentId,
  linkRelationship,
  onChangeLinkRelationship,
  onSubmit,
  isLoading,
}: ParentLinkTabProps) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Common.info");
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <span>{tCommon("info.linkParentStudent")}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("establishRelationshipLink")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("parentUserLabel")}
            </label>
            {usersList.length > 0 ? (
              <select
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                value={linkParentId}
                onChange={(e) => onChangeLinkParentId(e.target.value)}
                required
              >
                <option value="">{tCommon("info.selectParentUser")}</option>
                {usersList
                  .filter((u) => u.role === "PARENT")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
              </select>
            ) : (
              <Input
                placeholder={tCommon("info.parentUserUUID")}
                value={linkParentId}
                onChange={(e) => onChangeLinkParentId(e.target.value)}
                required
              />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("studentUserLabel")}
            </label>
            {usersList.length > 0 ? (
              <select
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
                value={linkStudentId}
                onChange={(e) => onChangeLinkStudentId(e.target.value)}
                required
              >
                <option value="">{tCommon("info.selectStudentUser")}</option>
                {usersList
                  .filter((u) => u.role === "STUDENT")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
              </select>
            ) : (
              <Input
                placeholder={tCommon("info.studentUserUUID")}
                value={linkStudentId}
                onChange={(e) => onChangeLinkStudentId(e.target.value)}
                required
              />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("relationshipTypeLabel")}
            </label>
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={linkRelationship}
              onChange={(e) =>
                onChangeLinkRelationship(e.target.value as ParentRelationship)
              }
              required
            >
              <option value="FATHER">{tCommon("info.father")}</option>
              <option value="MOTHER">{tCommon("info.mother")}</option>
              <option value="GUARDIAN">{tCommon("info.guardian")}</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="role"
            className="w-full"
            isLoading={isLoading}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            {t("linkParentStudentButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
