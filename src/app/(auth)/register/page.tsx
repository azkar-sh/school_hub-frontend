"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/schemas";
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
  UserPlus,
  BookOpen,
  Users,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

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
      confirmPassword: "",
      role: "STUDENT" as UserRole,
    },
  });

  const roleOptions: Array<{
    role: UserRole;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    activeBorder: string;
    activeBg: string;
    badgeClass: string;
  }> = [
    {
      role: "STUDENT",
      title: t("roleStudentTitle"),
      description: t("roleStudentDesc"),
      icon: GraduationCap,
      accentColor: "text-indigo-600 dark:text-indigo-400",
      activeBorder: "border-indigo-500 ring-2 ring-indigo-500/25",
      activeBg: "bg-indigo-500/10 dark:bg-indigo-950/40",
      badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    },
    {
      role: "TEACHER",
      title: t("roleTeacherTitle"),
      description: t("roleTeacherDesc"),
      icon: BookOpen,
      accentColor: "text-emerald-600 dark:text-emerald-400",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/25",
      activeBg: "bg-emerald-500/10 dark:bg-emerald-950/40",
      badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    },
    {
      role: "PARENT",
      title: t("roleParentTitle"),
      description: t("roleParentDesc"),
      icon: Users,
      accentColor: "text-amber-600 dark:text-amber-400",
      activeBorder: "border-amber-500 ring-2 ring-amber-500/25",
      activeBg: "bg-amber-500/10 dark:bg-amber-950/40",
      badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    },
  ];

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
  }) => {
    try {
      setErrorMsg(null);
      setIsLoading(true);

      // Backend expects { name, email, password, role } (without confirmPassword)
      const registerPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      const response = await authApi.register(registerPayload);
      const payload = response.data;

      setRoleTheme(payload.user.role);
      setAuth(payload.user, payload.accessToken);
      router.push("/dashboard");
    } catch (error) {
      setErrorMsg(getErrorMessage(error, t("registrationFailed")));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-lg pt-6">
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/" className="flex items-center gap-2 mb-3 group">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>

        <Card className="shadow-2xl border-border/70 rounded-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">{t("register")}</CardTitle>
            <CardDescription className="text-xs">
              {t("profileDetails")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
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
                {/* Interactive Visual Role Selector Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("selectRole")}
                  </label>
                  <Controller
                    name="role"
                    control={methods.control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {roleOptions.map((opt) => {
                          const isSelected = field.value === opt.role;
                          const Icon = opt.icon;
                          return (
                            <button
                              type="button"
                              key={opt.role}
                              onClick={() => field.onChange(opt.role)}
                              className={cn(
                                "relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer group text-xs",
                                isSelected
                                  ? cn(opt.activeBorder, opt.activeBg, "shadow-sm")
                                  : "border-border/70 hover:border-border hover:bg-muted/40"
                              )}
                            >
                              <div className="flex items-center justify-between w-full mb-1.5">
                                <div
                                  className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
                                    isSelected
                                      ? opt.badgeClass
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                {isSelected && (
                                  <CheckCircle2
                                    className={cn("w-4 h-4", opt.accentColor)}
                                  />
                                )}
                              </div>
                              <span className="font-bold text-sm tracking-tight text-foreground">
                                {opt.title}
                              </span>
                              <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                                {opt.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {methods.formState.errors.role && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {methods.formState.errors.role.message}
                    </p>
                  )}
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput
                    name="password"
                    label={t("password")}
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    helperText={t("passwordHint")}
                  />
                  <FormInput
                    name="confirmPassword"
                    label={t("confirmPassword")}
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-10 font-semibold shadow-md shadow-primary/20 mt-2"
                  isLoading={isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t("createAccount")}
                </Button>
              </form>
            </FormProvider>

            <p className="text-center text-xs text-muted-foreground pt-1">
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

