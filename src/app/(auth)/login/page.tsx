"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/schemas";
import { authApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { UserRole } from "@/types";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  GraduationCap,
  LogIn,
  BookOpen,
  Users,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, demoLoginAs } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("LoginPage");

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setErrorMsg(null);
      setIsLoading(true);
      const response = await authApi.login(data);
      const payload = response.data;

      const user = payload?.user;
      const accessToken = payload?.accessToken;

      if (!user || !user.role || !accessToken) {
        throw new Error(t("validUserInfoRequired"));
      }

      setRoleTheme(user.role as UserRole);
      setAuth(user, accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, t("invalidCredentials")));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Top Bar with Back Link & Controls */}
      <header className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-xl hover:bg-muted/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("backToHome")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md pt-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/" className="flex items-center gap-2 mb-3 group">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        <Card className="shadow-2xl border-border/70 rounded-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">{t("signIn")}</CardTitle>
            <CardDescription className="text-xs">
              {t("emailAddress")} & {t("password")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium animate-in fade-in duration-150">
                {errorMsg}
              </div>
            )}

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormInput
                  name="email"
                  label={t("emailAddress")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                />
                <FormInput
                  name="password"
                  label={t("password")}
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                />

                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-10 font-semibold shadow-md shadow-primary/20"
                  isLoading={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t("signIn")}
                </Button>
              </form>
            </FormProvider>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/70" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2.5 text-muted-foreground font-semibold text-[11px] tracking-wider">
                  {t("orQuickDemoLogin")}
                </span>
              </div>
            </div>

            {/* Quick Demo Login Role Buttons with Distinct Role Styling */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Student - Indigo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("STUDENT")}
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/15 hover:border-indigo-500/50 transition-all text-indigo-700 dark:text-indigo-300 text-xs font-medium cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>{t("student")}</span>
              </button>

              {/* Teacher - Emerald */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("TEACHER")}
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all text-emerald-700 dark:text-emerald-300 text-xs font-medium cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>{t("teacher")}</span>
              </button>

              {/* Parent - Amber */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("PARENT")}
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/50 transition-all text-amber-700 dark:text-amber-300 text-xs font-medium cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span>{t("parent")}</span>
              </button>

              {/* School Admin - Violet/Purple */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("SCHOOL_ADMIN")}
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/50 transition-all text-purple-700 dark:text-purple-300 text-xs font-medium cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>{t("admin")}</span>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-5">
              {t("noAccount")}{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                {t("createAccount")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

