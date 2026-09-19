import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AcademicYear } from "@/types";
import { ModalShell } from "./ModalShell";
import { useTranslations } from "next-intl";

interface CreateClassModalProps {
  name: string;
  onChangeName: (value: string) => void;
  grade: number;
  onChangeGrade: (value: number) => void;
  academicYears: AcademicYear[];
  selectedAyId: string;
  onChangeAyId: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateClassModal({
  name,
  onChangeName,
  grade,
  onChangeGrade,
  academicYears,
  selectedAyId,
  onChangeAyId,
  onClose,
  onSubmit,
}: CreateClassModalProps) {
  const t = useTranslations("Classes");
  return (
    <ModalShell title={t("createNewClass")} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">{t("className")}</label>
          <Input
            placeholder={t("classNamePlaceholder")}
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("gradeLevel")}
          </label>
          <Input
            type="number"
            min={1}
            max={12}
            value={grade}
            onChange={(e) => onChangeGrade(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">
            {t("academicYear")}
          </label>
          <select
            className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
            value={selectedAyId}
            onChange={(e) => onChangeAyId(e.target.value)}
            required
          >
            <option value="">{t("selectAcademicYear")}</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id}>
                {ay.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="role" className="w-full">
          {t("createClassSection")}
        </Button>
      </form>
    </ModalShell>
  );
}
