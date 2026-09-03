import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalShell } from "./ModalShell";

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
  return (
    <ModalShell title="Add New Subject" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Subject Name
          </label>
          <Input
            placeholder="e.g. Mathematics"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Subject Code
          </label>
          <Input
            placeholder="e.g. MATH-101"
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="role" className="w-full">
          Create Subject
        </Button>
      </form>
    </ModalShell>
  );
}
