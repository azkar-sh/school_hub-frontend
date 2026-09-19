import { Loader2, Users } from "lucide-react";
import { User } from "@/types";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface ViewStudentsModalProps {
  className: string;
  isLoading: boolean;
  students: User[];
  onClose: () => void;
}

export function ViewStudentsModal({
  className,
  isLoading,
  students,
  onClose,
}: ViewStudentsModalProps) {
  const t = useTranslations("Classes");
  return (
    <ModalShell title={t("studentsInClass", { className })} onClose={onClose}>
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">{t("loadingStudents")}</span>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
          <Users className="w-6 h-6" />
          <span className="text-sm">{t("noStudentsEnrolled")}</span>
        </div>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-auto pr-1">
          {students.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/30"
            >
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}
