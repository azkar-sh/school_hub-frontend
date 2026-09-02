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

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, demoLoginAs } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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
        throw new Error(
          "Response did not contain valid user information or role.",
        );
      }

      setRoleTheme(user.role as UserRole);
      setAuth(user, accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
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
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your School Hub account
          </p>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription className="text-xs">
              Enter your email and password below
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
                  label="Email Address"
                  type="email"
                  placeholder="name@schoolhub.edu"
                />
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                />

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>
            </FormProvider>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">
                  Or Quick Demo Login
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
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>Student</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("TEACHER")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Teacher</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("PARENT")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <Users className="w-4 h-4 text-amber-500" />
                <span>Parent</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("SCHOOL_ADMIN")}
                className="text-xs flex flex-col h-auto py-2.5 gap-1 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <ShieldAlert className="w-4 h-4 text-purple-500" />
                <span>Admin</span>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
