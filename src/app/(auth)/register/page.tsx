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

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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
          "Registration failed. Please check your information.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join School Hub platform today
          </p>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Register</CardTitle>
            <CardDescription className="text-xs">
              Fill out your profile details below
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
                  label="Full Name"
                  placeholder="Jane Doe"
                />
                <FormInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="jane.doe@schoolhub.edu"
                />
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                />
                <FormSelect
                  name="role"
                  label="Select Role"
                  options={[
                    {
                      label: "Student (Take quizzes & view scores)",
                      value: "STUDENT",
                    },
                    {
                      label: "Teacher (Create assessments & grade)",
                      value: "TEACHER",
                    },
                    {
                      label: "Parent (Monitor child progress)",
                      value: "PARENT",
                    },
                    {
                      label: "School Administrator (Manage schools & classes)",
                      value: "SCHOOL_ADMIN",
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
                  Create Account
                </Button>
              </form>
            </FormProvider>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
