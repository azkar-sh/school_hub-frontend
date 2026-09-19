import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface AssignHomeroomModalProps {
  usersList: User[];
  teacherId: string;
  onChangeTeacherId: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AssignHomeroomModal({
  usersList,
  teacherId,
  onChangeTeacherId,
  onClose,
  onSubmit,
}: AssignHomeroomModalProps) {
  const t = useTranslations("Classes");
  const tCommon = useTranslations("Common");
  return (
    <ModalShell title={t("assignHomeroomTeacher")} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("selectTeacher")}
          </label>
          {usersList.length > 0 ? (
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={teacherId}
              onChange={(e) => onChangeTeacherId(e.target.value)}
              required
            >
              <option value="">{t("selectTeacherPlaceholder")}</option>
              {usersList
                .filter((u) => u.role === "TEACHER")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          ) : (
            <Input
              placeholder={tCommon("info.userUUID")}
              value={teacherId}
              onChange={(e) => onChangeTeacherId(e.target.value)}
              required
            />
          )}
        </div>
        <Button type="submit" variant="role" className="w-full">
          {t("assignHomeroomTeacherButton")}
        </Button>
      </form>
    </ModalShell>
  );
}
