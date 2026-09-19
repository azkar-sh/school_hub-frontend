import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdminHeader() {
  const t = useTranslations("Common.info");
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="role" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t("schoolAdministration")}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          {t("schoolAcademicOperations")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("manageInstitutionProfiles")}
        </p>
      </div>
    </div>
  );
}
