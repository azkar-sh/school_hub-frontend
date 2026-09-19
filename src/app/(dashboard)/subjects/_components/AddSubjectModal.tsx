import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface AddSubjectModalProps {
  name: string;
  onChangeName: (value: string) => void;
  code: string;
  onChangeCode: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddSubjectModal({
  name,
  onChangeName,
  code,
  onChangeCode,
  onClose,
  onSubmit,
}: AddSubjectModalProps) {
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  return (
    <ModalShell title={tCommon("addSubject")} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("subjectName")}
          </label>
          <Input
            placeholder={tCommon("subjectNamePlaceholder")}
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("code")}
          </label>
          <Input
            placeholder={tCommon("subjectCodePlaceholder")}
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          {t("createSubject")}
        </Button>
      </form>
    </ModalShell>
  );
}
