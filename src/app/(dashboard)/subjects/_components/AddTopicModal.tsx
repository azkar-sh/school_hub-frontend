import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface AddTopicModalProps {
  name: string;
  onChangeName: (value: string) => void;
  description: string;
  onChangeDescription: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddTopicModal({
  name,
  onChangeName,
  description,
  onChangeDescription,
  onClose,
  onSubmit,
}: AddTopicModalProps) {
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  return (
    <ModalShell title={t("addTopic")} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("topicTitle")}
          </label>
          <Input
            placeholder={tCommon("topicNamePlaceholder")}
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
            placeholder={tCommon("topicOverview")}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          {t("saveTopic")}
        </Button>
      </form>
    </ModalShell>
  );
}
