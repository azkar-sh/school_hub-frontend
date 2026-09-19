import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface AddSubTopicModalProps {
  name: string;
  onChangeName: (value: string) => void;
  description: string;
  onChangeDescription: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddSubTopicModal({
  name,
  onChangeName,
  description,
  onChangeDescription,
  onClose,
  onSubmit,
}: AddSubTopicModalProps) {
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  return (
    <ModalShell title={t("addSubtopic")} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("subTopicTitle")}
          </label>
          <Input
            placeholder={tCommon("subtopicNamePlaceholder")}
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("descriptionOptional")}
          </label>
          <Input
            placeholder={tCommon("subtopicOverview")}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          {t("saveSubTopic")}
        </Button>
      </form>
    </ModalShell>
  );
}
