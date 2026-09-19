"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/schemas";
import { apiClient } from "@/lib/api-client";
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
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

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
      const response = await apiClient.post("/auth/login", data);
      const payload = response.data;

      // Handle payload shapes: { user, accessToken } or direct user object
      const user = payload?.user || (payload?.role ? payload : null);
      const accessToken =
        payload?.accessToken || payload?.token || "dummy_token";

      if (!user || !user.role) {
        throw new Error(t("validUserInfoRequired"));
      }

      setRoleTheme(user.role as UserRole);
      setAuth(user, accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("invalidCredentials");
      setErrorMsg(message);
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
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
      </div>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">{t("signIn")}</CardTitle>
            <CardDescription className="text-xs">
              {t("emailAddress")} & {t("password")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium">
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
                  className="w-full"
                  isLoading={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t("signIn")}
                </Button>
              </form>
            </FormProvider>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">
                  {t("orQuickDemoLogin")}
                </span>
              </div>
            </div>

            {/* Quick Demo Login Role Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("STUDENT")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{t("student")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("TEACHER")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>{t("teacher")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("PARENT")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>{t("parent")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("SCHOOL_ADMIN")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <ShieldAlert className="w-4 h-4 text-primary" />
                <span>{t("admin")}</span>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
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
