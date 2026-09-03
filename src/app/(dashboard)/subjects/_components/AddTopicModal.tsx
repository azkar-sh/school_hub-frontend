import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";

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
  return (
    <ModalShell title="Add Topic" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Topic Title
          </label>
          <Input
            placeholder="e.g. Quadratic Equations"
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
            placeholder="Brief overview of topic"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          Save Topic
        </Button>
      </form>
    </ModalShell>
  );
}
