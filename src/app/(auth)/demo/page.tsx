import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roles = [
  {
    title: "School Admin",
    detail: "School, members, academic years, classes, and assignments.",
    icon: ShieldCheck,
  },
  {
    title: "Teacher",
    detail: "Curriculum, assessments, submissions, and results.",
    icon: BookOpen,
  },
  {
    title: "Student",
    detail: "Upcoming assessments, attempts, and scores.",
    icon: GraduationCap,
  },
  { title: "Parent", detail: "Children and assessment progress.", icon: Users },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Learn Hub Demo
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            Choose a role to explore
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every preview uses the same seeded Garuda Hope school data.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map(({ title, detail, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{detail}</p>
                <Link href="/login">
                  <Button variant="role" className="w-full">
                    Open demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link
          className="text-sm font-semibold text-primary hover:underline"
          href="/"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
