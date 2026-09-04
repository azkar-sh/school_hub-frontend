import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { ModalShell } from "./ModalShell";

interface EnrollStudentModalProps {
  usersList: User[];
  isLoadingRegisteredStudents: boolean;
  registeredStudentsList: User[];
  studentId: string;
  onChangeStudentId: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EnrollStudentModal({
  usersList,
  isLoadingRegisteredStudents,
  registeredStudentsList,
  studentId,
  onChangeStudentId,
  onClose,
  onSubmit,
}: EnrollStudentModalProps) {
  return (
    <ModalShell title="Enroll Student into Class" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Select Student
          </label>
          {usersList.length > 0 ? (
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={studentId}
              onChange={(e) => onChangeStudentId(e.target.value)}
              required
            >
              <option value="">-- Select Student --</option>
              {usersList
                .filter((u) => u.role === "STUDENT")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          ) : (
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={studentId}
              onChange={(e) => onChangeStudentId(e.target.value)}
              required
            >
              <option value="">-- Select Student --</option>
              {usersList
                .filter((u) => u.role === "STUDENT")
                .filter(
                  (u) => !registeredStudentsList.some((s) => s.id === u.id),
                )
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          )}
        </div>
        <Button type="submit" variant="role" className="w-full">
          Confirm Enrollment
        </Button>
      </form>
    </ModalShell>
  );
}
