'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Award,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const { setRoleTheme, activeRole } = useRoleThemeStore();

  const handlePortalEnter = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Header */}
      <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            School<span className="text-primary">Hub</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" size="sm" className="rounded-xl shadow-md">
              Create Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 text-center relative overflow-hidden">
        {/* Glowing Ambient Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-primary/30 text-xs font-semibold backdrop-blur-md bg-background/80">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-primary inline animate-spin" />
          Modern Educational Assessment Platform
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-tight">
          Empowering Education with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
            Role-Adaptive Learning
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed">
          One unified portal for Teachers, Students, and Parents. Experience automated assessment grading, interactive quizzes, and real-time performance tracking.
        </p>

        {/* Dynamic Role Demo Switcher & Portal Selector */}
        <div className="mt-12 w-full max-w-5xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Select a Role Portal to Preview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Role Card */}
            <Card
              className="relative group border-primary/30 hover:border-primary/80 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handlePortalEnter('STUDENT')}
            >
              <div className="h-2 gradient-role" />
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <Badge variant="student" className="mb-2">
                  Student Portal
                </Badge>
                <h3 className="text-xl font-bold text-foreground">Interactive Learning</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Take online assessments, solve quizzes with instant timers, track progress badges, and view scores.
                </p>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-primary group-hover:text-primary-foreground border-primary/30">
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Role Card */}
            <Card
              className="relative group border-primary/30 hover:border-primary/80 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handlePortalEnter('TEACHER')}
            >
              <div className="h-2 gradient-role" />
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <Badge variant="teacher" className="mb-2">
                  Teacher Portal
                </Badge>
                <h3 className="text-xl font-bold text-foreground">Assessment Builder</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Create customized question banks, publish exams, grade student submissions, and manage subject topics.
                </p>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-primary group-hover:text-primary-foreground border-primary/30">
                  <span>Enter Teacher Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Parent Role Card */}
            <Card
              className="relative group border-primary/30 hover:border-primary/80 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handlePortalEnter('PARENT')}
            >
              <div className="h-2 gradient-role" />
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <Badge variant="parent" className="mb-2">
                  Parent Portal
                </Badge>
                <h3 className="text-xl font-bold text-foreground">Performance Monitor</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Monitor children&apos;s academic progression, review test score analytics, and track completed assignments.
                </p>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-primary group-hover:text-primary-foreground border-primary/30">
                  <span>Enter Parent Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl text-left">
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base">Auto-Grading Engine</h4>
              <p className="text-xs text-muted-foreground mt-1">Instant scoring for MCQ & True/False questions with precise point metrics.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base">Curriculum Hierarchy</h4>
              <p className="text-xs text-muted-foreground mt-1">Structured mapping of Subjects, Topics, SubTopics, and Class academic years.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base">Dynamic Themes</h4>
              <p className="text-xs text-muted-foreground mt-1">Tailored visual identity for each role with crisp Dark & Light mode accessibility.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/40 text-center text-xs text-muted-foreground">
        © 2026 School Hub Assessment System. All rights reserved.
      </footer>
    </div>
  );
}
