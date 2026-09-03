import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";

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
  return (
    <ModalShell title="Add Sub-Topic" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Sub-Topic Title
          </label>
          <Input
            placeholder="e.g. Factoring Quadratics"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Description (Optional)
          </label>
          <Input
            placeholder="Sub-topic breakdown"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          Save Sub-Topic
        </Button>
      </form>
    </ModalShell>
  );
}
