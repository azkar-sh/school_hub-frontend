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
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Layers,
  Clock,
  FileSpreadsheet,
  TrendingUp,
  School,
  ChevronDown,
  ExternalLink,
  Award,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const { setRoleTheme } = useRoleThemeStore();
  const t = useTranslations('LandingPage');

  // Interactive Product Stage Tab State
  const [activeStage, setActiveStage] = React.useState<'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN'>('TEACHER');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const handlePortalEnter = (role: UserRole) => {
    setRoleTheme(role);
    demoLoginAs(role);
    router.push('/dashboard');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 antialiased overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight">
                  School<span className="text-primary">Hub</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                  OS
                </span>
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              {t('nav.howItWorks')}
            </a>
            <a href="#preview-stage" className="hover:text-foreground transition-colors">
              {t('nav.demo')}
            </a>
            <a href="#roles" className="hover:text-foreground transition-colors">
              {t('nav.roles')}
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              {t('nav.features')}
            </a>
            <a href="#impact" className="hover:text-foreground transition-colors">
              {t('nav.impact')}
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              {t('nav.faq')}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              {t('nav.signIn')}
            </Button>
          </Link>
          <Link href="/register" className="hidden sm:inline-block">
            <Button variant="default" size="sm" className="rounded-xl shadow-sm shadow-primary/25 font-semibold">
              {t('nav.createAccount')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 flex flex-col items-center text-center overflow-hidden">
          {/* Subtle Ambient Aura */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-primary/15 via-indigo-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-semibold backdrop-blur-md mb-8 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{t('badge')}</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl leading-[1.12]">
            {t('empoweringEducation')}{' '}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent underline decoration-primary/30 decoration-wavy decoration-from-font underline-offset-8">
              {t('roleAdaptiveLearning')}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-3xl font-normal leading-relaxed">
            {t('heroDescription')}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#preview-stage">
              <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 font-semibold px-7 h-12 text-base gap-2 group">
                <span>{t('primaryCta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="rounded-xl border-border/80 hover:bg-muted/50 font-semibold px-7 h-12 text-base">
                {t('secondaryCta')}
              </Button>
            </a>
          </div>

          {/* Interactive Live Product Stage */}
          <div id="preview-stage" className="mt-16 w-full max-w-5xl scroll-mt-24">
            <div className="flex flex-col items-center mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>{t('livePreviewBadge')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('livePreviewHint')}</p>
            </div>

            {/* Stage Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl border border-border/50 max-w-2xl mx-auto mb-6">
              <button
                type="button"
                onClick={() => setActiveStage('TEACHER')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeStage === 'TEACHER'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('stageTabs.teacher')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStage('STUDENT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeStage === 'STUDENT'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t('stageTabs.student')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStage('PARENT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeStage === 'PARENT'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{t('stageTabs.parent')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStage('ADMIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeStage === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <School className="w-4 h-4" />
                <span>{t('stageTabs.admin')}</span>
              </button>
            </div>

            {/* Stage Mockup Frame */}
            <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden text-left transition-all">
              {/* Window Title Bar */}
              <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">schoolhub.app/portal/{activeStage.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-medium">{t('demoSchool')}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs rounded-lg gap-1 border-border/60"
                    onClick={() => handlePortalEnter(activeStage === 'ADMIN' ? 'SCHOOL_ADMIN' : activeStage)}
                  >
                    <span>{t('launchLive')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Window Content by Active Stage */}
              <div className="p-6 sm:p-8">
                {activeStage === 'TEACHER' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {t('stageBadgeTeacher')}
                          </span>
                          <span className="text-xs text-muted-foreground">{t('stagePreviews.teacher.badge')}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2">{t('stagePreviews.teacher.examTitle')}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('stagePreviews.teacher.topic')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Zap className="w-3.5 h-3.5" />
                          {t('stagePreviews.teacher.autoGraded')}
                        </span>
                        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          {t('stagePreviews.teacher.xlsxImportBadge')}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400">{t('stagePreviews.teacher.qType')}</span>
                        <span className="text-muted-foreground">{t('mathQuestionPoints')}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-foreground">
                        {t('stagePreviews.teacher.questionPreview')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3 rounded-lg border border-border/60 bg-card flex items-center justify-between">
                          <span>A. 4/5</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="p-3 rounded-lg border border-border/60 bg-card text-muted-foreground">B. 3/4</div>
                        <div className="p-3 rounded-lg border border-border/60 bg-card text-muted-foreground">C. 5/4</div>
                        <div className="p-3 rounded-lg border border-border/60 bg-card text-muted-foreground">D. 1/2</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{t('curriculumHierarchy')}</span>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        onClick={() => handlePortalEnter('TEACHER')}
                      >
                        {t('enterTeacherMode')}
                      </Button>
                    </div>
                  </div>
                )}

                {activeStage === 'STUDENT' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {t('stageBadgeStudent')}
                          </span>
                          <span className="text-xs text-muted-foreground">{t('stagePreviews.student.studentName')}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2">{t('stagePreviews.student.title')}</h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Clock className="w-4 h-4" />
                        <span>{t('stagePreviews.student.timeRemaining')}</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <span>{t('stagePreviews.student.currentQuestion')}</span>
                        <span>{t('stagePreviews.student.status')}</span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-foreground">
                        {t('stagePreviews.student.prompt')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3 rounded-lg border border-border/60 bg-card hover:border-indigo-500 transition-colors cursor-pointer">
                          {t('stagePreviews.student.optA')}
                        </div>
                        <div className="p-3 rounded-lg border-2 border-indigo-500 bg-indigo-500/10 font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                          <span>{t('stagePreviews.student.optB')}</span>
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="p-3 rounded-lg border border-border/60 bg-card hover:border-indigo-500 transition-colors cursor-pointer">
                          {t('stagePreviews.student.optC')}
                        </div>
                        <div className="p-3 rounded-lg border border-border/60 bg-card hover:border-indigo-500 transition-colors cursor-pointer">
                          {t('stagePreviews.student.optD')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                        <span>{t('questionsAnswered')}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                        onClick={() => handlePortalEnter('STUDENT')}
                      >
                        {t('enterStudentMode')}
                      </Button>
                    </div>
                  </div>
                )}

                {activeStage === 'PARENT' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {t('stageBadgeParent')}
                          </span>
                          <span className="text-xs text-muted-foreground">{t('stagePreviews.parent.childName')}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2">{t('stagePreviews.parent.title')}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {t('stagePreviews.parent.statusBadge')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-border/60 bg-muted/20">
                        <span className="text-xs text-muted-foreground">{t('cumulativeAverage')}</span>
                        <div className="text-3xl font-extrabold text-foreground mt-1">{t('stagePreviews.parent.overallGpa')}</div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t('topRank')}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-border/60 bg-muted/20">
                        <span className="text-xs text-muted-foreground">{t('latestGradedExam')}</span>
                        <div className="text-sm font-bold text-foreground mt-1 truncate">{t('stagePreviews.parent.recentExam')}</div>
                        <span className="text-xs font-extrabold text-primary">{t('stagePreviews.parent.score')}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-border/60 bg-muted/20">
                        <span className="text-xs text-muted-foreground">{t('alertChannel')}</span>
                        <div className="text-xs font-medium text-foreground mt-1">{t('realtimeGradeNotification')}</div>
                        <span className="text-[11px] text-muted-foreground">{t('zeroSemesterEndSurprises')}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                      <p className="text-xs sm:text-sm text-foreground italic">
                        &quot;{t('stagePreviews.parent.teacherNote')}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{t('monitoredChild')}</span>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                        onClick={() => handlePortalEnter('PARENT')}
                      >
                        {t('enterParentMode')}
                      </Button>
                    </div>
                  </div>
                )}

                {activeStage === 'ADMIN' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            {t('stageBadgeAdmin')}
                          </span>
                          <span className="text-xs text-muted-foreground">{t('stagePreviews.admin.schoolName')}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2">{t('stagePreviews.admin.title')}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('stagePreviews.admin.academicYear')}</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('systemGovernance')}</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="text-2xl font-bold text-foreground">6</div>
                          <div className="text-[11px] text-muted-foreground">{t('teachersCount')}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="text-2xl font-bold text-foreground">16</div>
                          <div className="text-[11px] text-muted-foreground">{t('studentsCount')}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="text-2xl font-bold text-foreground">2</div>
                          <div className="text-[11px] text-muted-foreground">{t('classesCount')}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="text-2xl font-bold text-foreground">6</div>
                          <div className="text-[11px] text-muted-foreground">{t('subjectsCount')}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-card border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                        <span className="font-semibold text-foreground">{t('homeroomAllocations')}</span>
                        <span className="text-muted-foreground">{t('stagePreviews.admin.homeroom')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{t('stagePreviews.admin.integrity')}</span>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                        onClick={() => handlePortalEnter('SCHOOL_ADMIN')}
                      >
                        {t('enterAdminMode')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem vs. Solution Section */}
        <section id="how-it-works" className="w-full py-20 px-4 max-w-6xl border-t border-border/40 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              {t('problemSolution.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('problemSolution.title')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              {t('problemSolution.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <Card className="border-red-500/20 bg-red-500/5 relative overflow-hidden">
              <div className="h-1.5 bg-red-500/60" />
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('problemSolution.beforeTitle')}</h3>
                    <p className="text-xs text-muted-foreground">{t('disconnectedTraditional')}</p>
                  </div>
                </div>

                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.beforeItem1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.beforeItem2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.beforeItem3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.beforeItem4')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* The School Hub Way */}
            <Card className="border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden shadow-lg shadow-emerald-500/5">
              <div className="h-1.5 bg-emerald-500" />
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('problemSolution.afterTitle')}</h3>
                    <p className="text-xs text-muted-foreground">{t('unifiedContinuous')}</p>
                  </div>
                </div>

                <ul className="space-y-4 text-sm text-foreground">
                  <li className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.afterItem1')}</span>
                  </li>
                  <li className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.afterItem2')}</span>
                  </li>
                  <li className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.afterItem3')}</span>
                  </li>
                  <li className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('problemSolution.afterItem4')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Indonesia-First Context Banner */}
        <section className="w-full py-10 px-4 max-w-6xl">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-3 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {t('marketFocus.tag')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {t('marketFocus.title')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t('marketFocus.description')}
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="rounded-xl font-semibold gap-2 shadow-md shadow-primary/25"
                onClick={() => handlePortalEnter('TEACHER')}
              >
                <span>{t('demoSmaGarudaHope')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Role Portals Grid */}
        <section id="roles" className="w-full py-20 px-4 max-w-6xl border-t border-border/40 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              {t('selectRolePreview')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('oneUnifiedCore')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              {t('oneUnifiedDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* School Admin */}
            <Card
              className="relative group border-purple-500/20 hover:border-purple-500/80 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => handlePortalEnter('SCHOOL_ADMIN')}
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
              <CardContent className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <School className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="mb-2 border-purple-500/30 text-purple-600 dark:text-purple-400">
                    {t('adminPortal.title')}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mt-1">{t('adminPortal.feature')}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {t('adminPortal.description')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-purple-600 group-hover:text-white border-purple-500/30">
                  <span>{t('adminPortal.button')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Teacher */}
            <Card
              className="relative group border-emerald-500/20 hover:border-emerald-500/80 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => handlePortalEnter('TEACHER')}
            >
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Badge variant="teacher" className="mb-2">
                    {t('teacherPortal.title')}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mt-1">{t('teacherPortal.feature')}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {t('teacherPortal.description')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-emerald-600 group-hover:text-white border-emerald-500/30">
                  <span>{t('teacherPortal.button')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Student */}
            <Card
              className="relative group border-indigo-500/20 hover:border-indigo-500/80 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => handlePortalEnter('STUDENT')}
            >
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />
              <CardContent className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <Badge variant="student" className="mb-2">
                    {t('studentPortal.title')}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mt-1">{t('studentPortal.feature')}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {t('studentPortal.description')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-indigo-600 group-hover:text-white border-indigo-500/30">
                  <span>{t('studentPortal.button')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Parent */}
            <Card
              className="relative group border-amber-500/20 hover:border-amber-500/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => handlePortalEnter('PARENT')}
            >
              <div className="h-2 bg-gradient-to-r from-amber-500 to-rose-500" />
              <CardContent className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <Badge variant="parent" className="mb-2">
                    {t('parentPortal.title')}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mt-1">{t('parentPortal.feature')}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {t('parentPortal.description')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full group-hover:bg-amber-600 group-hover:text-white border-amber-500/30">
                  <span>{t('parentPortal.button')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="w-full py-20 px-4 max-w-6xl border-t border-border/40 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              {t('features.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('features.title')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Auto Grading */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.autoGrading.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.autoGrading.description')}
              </p>
            </div>

            {/* Curriculum Hierarchy */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.curriculum.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.curriculum.description')}
              </p>
            </div>

            {/* Excel Import */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.xlsx.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.xlsx.description')}
              </p>
            </div>

            {/* Timed Exams */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.timed.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.timed.description')}
              </p>
            </div>

            {/* Parent Transparency */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.parentVisibility.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.parentVisibility.description')}
              </p>
            </div>

            {/* Role Theming */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{t('features.themes.title')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('features.themes.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Impact Metrics Banner */}
        <section id="impact" className="w-full py-20 px-4 border-t border-border/40 bg-muted/20 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-primary">{t('metrics.stat1')}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">{t('metrics.label1')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-primary">{t('metrics.stat2')}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">{t('metrics.label2')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-primary">{t('metrics.stat3')}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">{t('metrics.label3')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-primary">{t('metrics.stat4')}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">{t('metrics.label4')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section id="faq" className="w-full py-20 px-4 max-w-6xl border-t border-border/40 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              {t('faq.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Q1 */}
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <button
                type="button"
                className="w-full p-5 text-left font-semibold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleFaq(0)}
              >
                <span>{t('faq.q1')}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${openFaq === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === 0 && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                  {t('faq.a1')}
                </div>
              )}
            </div>

            {/* Q2 */}
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <button
                type="button"
                className="w-full p-5 text-left font-semibold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleFaq(1)}
              >
                <span>{t('faq.q2')}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${openFaq === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === 1 && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                  {t('faq.a2')}
                </div>
              )}
            </div>

            {/* Q3 */}
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <button
                type="button"
                className="w-full p-5 text-left font-semibold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleFaq(2)}
              >
                <span>{t('faq.q3')}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${openFaq === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === 2 && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                  {t('faq.a3')}
                </div>
              )}
            </div>

            {/* Q4 */}
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <button
                type="button"
                className="w-full p-5 text-left font-semibold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleFaq(3)}
              >
                <span>{t('faq.q4')}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${openFaq === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === 3 && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                  {t('faq.a4')}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="w-full py-16 px-4 max-w-5xl mb-12">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-white text-center shadow-xl shadow-primary/20 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('ctaBanner.title')}
            </h2>
            <p className="text-primary-foreground/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('ctaBanner.description')}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl font-bold px-8 h-12 text-foreground shadow-md hover:bg-white"
                onClick={() => handlePortalEnter('TEACHER')}
              >
                {t('ctaBanner.primaryBtn')}
              </Button>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl font-semibold px-8 h-12 text-white border-white/30 hover:bg-white/10"
                >
                  {t('ctaBanner.secondaryBtn')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-card text-muted-foreground text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{t('schoolHubOs')}</span>
              <span>{t('schoolHubOsSubtitle')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" onClick={() => handlePortalEnter('TEACHER')} className="hover:text-foreground transition-colors cursor-pointer">
              {t('teacherDemo')}
            </button>
            <button type="button" onClick={() => handlePortalEnter('STUDENT')} className="hover:text-foreground transition-colors cursor-pointer">
              {t('studentDemo')}
            </button>
            <button type="button" onClick={() => handlePortalEnter('PARENT')} className="hover:text-foreground transition-colors cursor-pointer">
              {t('parentDemo')}
            </button>
            <button type="button" onClick={() => handlePortalEnter('SCHOOL_ADMIN')} className="hover:text-foreground transition-colors cursor-pointer">
              {t('adminDemo')}
            </button>
          </div>

          <div>{t('footer')}</div>
        </div>
      </footer>
    </div>
  );
}
