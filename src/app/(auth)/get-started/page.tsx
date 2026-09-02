import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GetStartedPage() {
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
            School setup
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Start with a role, then connect your school workspace.
          </p>
        </div>
        <div className="space-y-3">
          <Link href="/register">
            <Button variant="role" size="lg" className="w-full">
              Continue to registration <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="/login"
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
