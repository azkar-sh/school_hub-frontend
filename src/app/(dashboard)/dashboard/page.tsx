'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { getMockRecentAssessments } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Loader2,
} from 'lucide-react';

interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  questions?: unknown[];
  submissionsCount?: number;
}

export default function DashboardPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  // Live data state (only fetched when not in demo mode)
  const [liveAssessments, setLiveAssessments] = React.useState<LiveAssessment[]>([]);
  const [isLoadingLive, setIsLoadingLive] = React.useState(false);
  const [liveFetchError, setLiveFetchError] = React.useState(false);

  React.useEffect(() => {
    if (isDemoMode) return;
    const endpoint =
      currentRole === 'TEACHER'
        ? '/assessments/teacher'
        : currentRole === 'STUDENT'
        ? '/assessments/student'
        : null;

    if (!endpoint) return;

    setIsLoadingLive(true);
    setLiveFetchError(false);

    apiClient
      .get(endpoint)
      .then((res) => setLiveAssessments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setLiveFetchError(true))
      .finally(() => setIsLoadingLive(false));
  }, [isDemoMode, currentRole]);

  // Decide which assessment rows to show
  const mockRecentItems = getMockRecentAssessments(currentRole);
  const displayAssessments: Array<{
    id: string;
    title: string;
    type: string;
    subject?: string;
    due: string;
    questionsCount: number;
    points: number;
  }> = isDemoMode
    ? mockRecentItems
    : liveAssessments.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        due: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : 'No due date',
        questionsCount: a.questions?.length ?? 0,
        points: 0,
      }));

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden gradient-role text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 capitalize">
                {currentRole.toLowerCase()} Mode
              </Badge>
              <span className="text-xs text-white/80 font-medium">
                • {isDemoMode ? 'Demo Preview' : 'Academic Term 2026'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Welcome Back'}! 👋
            </h1>
            <p className="text-sm text-white/90 max-w-xl">
              {currentRole === 'TEACHER' && 'Manage your curriculum assessments, grade student submissions, and review topic coverage.'}
              {currentRole === 'STUDENT' && 'View your pending assessments, practice quizzes, and track your overall grade averages.'}
              {currentRole === 'PARENT' && 'Monitor your child\'s academic progress, review quiz scores, and track homework submission.'}
            </p>
          </div>

          {currentRole === 'TEACHER' && (
            <Link href="/assessments/new">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 shadow-lg font-bold border-none">
                <PlusCircle className="w-5 h-5 mr-2" />
                New Assessment
              </Button>
            </Link>
          )}

          {currentRole === 'STUDENT' && (
            <Link href="/assessments">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg font-bold border-none">
                <FileCheck2 className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentRole === 'STUDENT' && (
          <>
            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Quizzes Taken</CardTitle>
                <FileCheck2 className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {isDemoMode ? 12 : liveAssessments.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>{isDemoMode ? '+3 this week' : 'from your account'}</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Average Score</CardTitle>
                <Award className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">92.5%</div>
                <p className="text-xs text-muted-foreground mt-1">Grade A (Honor Roll)</p>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Pending Due</CardTitle>
                <Clock className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-500">2</div>
                <p className="text-xs text-muted-foreground mt-1">Math & Science Exams</p>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Study Streak</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-500">5 Days</div>
                <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
              </CardContent>
            </Card>
          </>
        )}

        {currentRole === 'TEACHER' && (
          <>
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Active Assessments</CardTitle>
                <BookOpen className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {isDemoMode ? 8 : liveAssessments.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Quizzes & Exams published</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Enrolled Students</CardTitle>
                <Users className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">145</div>
                <p className="text-xs text-muted-foreground mt-1">Across 4 Classes</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Pending Grading</CardTitle>
                <Clock className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-500">14</div>
                <p className="text-xs text-muted-foreground mt-1">Submissions waiting review</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Class Average</CardTitle>
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-500">86.4%</div>
                <p className="text-xs text-muted-foreground mt-1">+2.1% from last term</p>
              </CardContent>
            </Card>
          </>
        )}

        {currentRole === 'PARENT' && (
          <>
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Children Linked</CardTitle>
                <Users className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">1</div>
                <p className="text-xs text-muted-foreground mt-1">Alex Rivera (Grade 10)</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Child GPA / Avg</CardTitle>
                <Award className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">92.5%</div>
                <p className="text-xs text-muted-foreground mt-1">Grade 10 Class Rank #3</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Completed Tests</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-500">12 / 14</div>
                <p className="text-xs text-muted-foreground mt-1">85% Completion rate</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Attendance</CardTitle>
                <GraduationCap className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">98%</div>
                <p className="text-xs text-muted-foreground mt-1">Perfect attendance badge</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Area: Recent Assessments & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {currentRole === 'TEACHER' ? 'Your Published Assessments' : 'Available Assessments & Quizzes'}
                </CardTitle>
                <CardDescription>
                  {currentRole === 'TEACHER'
                    ? 'Assessments you have created and published'
                    : 'Practice tests and graded class examinations'}
                </CardDescription>
              </div>
              <Link href="/assessments">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingLive ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading assessments…</span>
                </div>
              ) : liveFetchError && !isDemoMode ? (
                <div className="py-6 text-center text-xs text-destructive">
                  Failed to load assessments. Please try refreshing.
                </div>
              ) : displayAssessments.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No assessments found.
                </div>
              ) : (
                displayAssessments.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {item.type}
                        </Badge>
                        {item.subject && (
                          <span className="text-xs text-muted-foreground font-medium">{item.subject}</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-base text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.questionsCount > 0 && `${item.questionsCount} Questions • `}
                        {item.points > 0 && `${item.points} Points • `}
                        <span className="text-amber-500 font-medium">{item.due}</span>
                      </p>
                    </div>
                    <Link href={`/assessments/${item.id}`}>
                      <Button variant="role" size="sm">
                        {currentRole === 'TEACHER'
                          ? 'Manage'
                          : currentRole === 'PARENT'
                          ? 'View Details'
                          : 'Take Quiz'}
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widget: Subject Performance Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentRole === 'PARENT' ? "Child's Subject Performance" : 'Subject Performance Breakdown'}
              </CardTitle>
              <CardDescription>Current term score mastery per topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {currentRole === 'TEACHER' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Mathematics (Class Avg)</span>
                      <span className="text-emerald-500">86%</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Physics & Mechanics</span>
                      <span className="text-indigo-500">79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Biology & Ecology</span>
                      <span className="text-emerald-500">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>World History</span>
                      <span className="text-amber-500">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Mathematics (Algebra)</span>
                      <span className="text-emerald-500">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Physics & Mechanics</span>
                      <span className="text-indigo-500">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Biology & Ecology</span>
                      <span className="text-amber-500">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>World History & Civics</span>
                      <span className="text-emerald-500">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
