import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function GetStartedPage() {
  const t = await getTranslations("GetStartedPage");
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-lg space-y-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          Learn Hub
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {t("subtitle")}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            {t("createAccount")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="space-y-3">
          <Link href="/register">
            <Button variant="role" size="lg" className="w-full">
              {t("continueRegistration")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="/login"
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            {t("alreadyHaveAccount")}
          </Link>
        </div>
      </div>
    </main>
  );
}
