"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/schemas";
import { authApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { UserRole } from "@/types";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("RegisterPage");

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT" as UserRole,
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      setErrorMsg(null);
      setIsLoading(true);
      const response = await authApi.register(data);
      const payload = response.data;

      setRoleTheme(payload.user.role);
      setAuth(payload.user, payload.accessToken);
      router.push("/dashboard");
    } catch (error) {
      setErrorMsg(
        getErrorMessage(
          error,
          t("registrationFailed"),
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
      </div>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">{t("register")}</CardTitle>
            <CardDescription className="text-xs">
              {t("profileDetails")}
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
                  name="name"
                  label={t("fullName")}
                  placeholder={t("fullNamePlaceholder")}
                />
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
                <FormSelect
                  name="role"
                  label={t("selectRole")}
                  options={[
                    {
                      label: t("studentRoleOption"),
                      value: "STUDENT",
                    },
                    {
                      label: t("teacherRoleOption"),
                      value: "TEACHER",
                    },
                    {
                      label: t("parentRoleOption"),
                      value: "PARENT",
                    },
                  ]}
                />

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t("createAccount")}
                </Button>
              </form>
            </FormProvider>

            <p className="text-center text-xs text-muted-foreground mt-4">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                {t("signIn")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
