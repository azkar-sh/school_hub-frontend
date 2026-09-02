'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import {
  getMockRecentAssessments,
  getMockSchoolAdminOverview,
  getMockSchoolAdminAcademicYear,
  getMockSchoolAdminRecentActivity,
  getMockTeacherDashboardClasses,
  getMockStudentClassInfo,
  getMockStudentRecentResults,
  getMockParentChildren,
  getMockParentRecentResults,
} from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';
import { useFetchData } from '@/lib/use-fetch-data';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  School as SchoolIcon,
  CalendarDays,
  UserRound,
  Activity,
  PlayCircle,
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

  // Live data (only fetched when not in demo mode)
  const shouldFetchLive = !isDemoMode && (currentRole === 'TEACHER' || currentRole === 'STUDENT');
  const liveEndpoint =
    currentRole === 'TEACHER' ? '/assessments/teacher' : currentRole === 'STUDENT' ? '/assessments/student' : null;

  const { data: liveAssessmentsData, isLoading: isLoadingLive, error: liveFetchError } = useFetchData<LiveAssessment[]>(
    () => apiClient.get<LiveAssessment[]>(liveEndpoint!).then((res) => (Array.isArray(res.data) ? res.data : [])),
    [currentRole],
    shouldFetchLive && !!liveEndpoint,
  );
  const liveAssessments = liveAssessmentsData ?? [];

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

  // Mock data for new sections
  const schoolAdminOverview = getMockSchoolAdminOverview();
  const schoolAdminAcademicYear = getMockSchoolAdminAcademicYear();
  const schoolAdminActivity = getMockSchoolAdminRecentActivity();
  const teacherClasses = getMockTeacherDashboardClasses();
  const studentClass = getMockStudentClassInfo();
  const studentRecentResults = getMockStudentRecentResults();
  const parentChildren = getMockParentChildren();
  const parentRecentResults = getMockParentRecentResults();

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
              {currentRole === 'SCHOOL_ADMIN' &&
                'Manage your school, academic years, classes, members, and teaching assignments.'}
              {currentRole === 'TEACHER' &&
                'Manage your curriculum assessments, grade student submissions, and review topic coverage.'}
              {currentRole === 'STUDENT' &&
                'View your pending assessments, practice quizzes, and track your overall grade averages.'}
              {currentRole === 'PARENT' &&
                "Monitor your child's academic progress, review quiz scores, and track homework submission."}
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

          {currentRole === 'SCHOOL_ADMIN' && (
            <Link href="/academic-years">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 shadow-lg font-bold border-none">
                <CalendarDays className="w-5 h-5 mr-2" />
                Manage Years
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* SCHOOL_ADMIN Stats */}
        {currentRole === 'SCHOOL_ADMIN' && (
          <>
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Teachers</CardTitle>
                <UserRound className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {schoolAdminOverview.teachersCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active teaching staff</p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Students</CardTitle>
                <GraduationCap className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {schoolAdminOverview.studentsCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Classes</CardTitle>
                <SchoolIcon className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {schoolAdminOverview.classesCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active class sections</p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Subjects</CardTitle>
                <BookOpen className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {schoolAdminOverview.subjectsCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered subjects</p>
              </CardContent>
            </Card>
          </>
        )}

        {/* TEACHER Stats — Tree: My Classes, Assessments, Pending Results */}
        {currentRole === 'TEACHER' && (
          <>
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">My Classes</CardTitle>
                <SchoolIcon className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {isDemoMode ? teacherClasses.length : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Teaching assignments</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Assessments</CardTitle>
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">
                  {isDemoMode ? 8 : liveAssessments.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Quizzes & exams published</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Pending Results</CardTitle>
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

        {currentRole === 'PARENT' && (
          <>
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Children Linked</CardTitle>
                <Users className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">{parentChildren.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {parentChildren[0]?.name} (Grade {studentClass.grade})
                </p>
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

      {/* ===================== SCHOOL_ADMIN Content ===================== */}
      {currentRole === 'SCHOOL_ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Academic Year */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Current Academic Year
              </CardTitle>
              <CardDescription>Active term overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {schoolAdminAcademicYear.name}
                  </span>
                  <Badge
                    variant={schoolAdminAcademicYear.status === 'Active' ? 'role' : 'outline'}
                    className="ml-2"
                  >
                    {schoolAdminAcademicYear.status}
                  </Badge>
                </div>
                <Link href="/academic-years">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <SchoolIcon className="w-4 h-4" />
                    <span>Classes</span>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground mt-1">
                    {schoolAdminAcademicYear.classesCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>Students</span>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground mt-1">
                    {schoolAdminAcademicYear.studentsCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest school events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {schoolAdminActivity.map((act) => (
                <div key={act.id} className="flex flex-col gap-1 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-foreground">{act.action}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{act.user}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== TEACHER Content ===================== */}
      {currentRole === 'TEACHER' && (
        <div className="space-y-6">
          {/* My Classes — Tree: Class Name, Subject, Student Count, Assessment Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Classes you are currently teaching</CardDescription>
              </div>
              <Link href="/classes">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemoMode ? (
                teacherClasses.map((cls) => (
                  <div
                    key={`${cls.id}-${cls.subject}`}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <SchoolIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">Class {cls.name}</h4>
                        <p className="text-xs text-muted-foreground">{cls.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {cls.studentCount} students
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        {cls.assessmentCount} assessments
                      </span>
                      <Link href="/classes">
                        <Button variant="role" size="sm" className="text-xs">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No classes assigned yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Assessments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Assessments</CardTitle>
                <CardDescription>Assessments you have created and published</CardDescription>
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
                        Manage
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== STUDENT Content ===================== */}
      {currentRole === 'STUDENT' && (
        <div className="space-y-6">
          {/* My Class — Tree: class info card */}
          <Card className="border-indigo-500/20 bg-indigo-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SchoolIcon className="w-5 h-5 text-indigo-500" />
                My Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">Class {studentClass.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Grade {studentClass.grade} • {studentClass.academicYear}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Homeroom: {studentClass.homeroomTeacher}
                    </p>
                  </div>
                </div>
                <Link href="/assessments">
                  <Button variant="role" size="sm">
                    <FileCheck2 className="w-4 h-4 mr-1.5" />
                    View Assessments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assessments — Tree: Assessment, Subject, Due Date, Start */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Assessments</CardTitle>
                <CardDescription>Practice tests and graded class examinations</CardDescription>
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
                        <span className="text-amber-500 font-medium">Due: {item.due}</span>
                      </p>
                    </div>
                    <Link href={`/assessments/${item.id}`}>
                      <Button variant="role" size="sm">
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Start
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Results — Tree: Assessment, Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your latest graded assessments</CardDescription>
              </div>
              <Link href="/results">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemoMode ? (
                studentRecentResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{result.assessment}</h4>
                      <p className="text-xs text-muted-foreground">{result.subject} • {result.date}</p>
                    </div>
                    <Badge
                      variant={result.score >= 80 ? 'secondary' : 'outline'}
                      className={`text-sm font-extrabold ${result.score >= 80 ? 'bg-emerald-500/15 text-emerald-600' : 'text-amber-500 border-amber-500/30'}`}
                    >
                      {result.score}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No results yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== PARENT Content ===================== */}
      {currentRole === 'PARENT' && (
        <div className="space-y-6">
          {/* Children — Tree: Child Name, Class, Latest Result */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Children</CardTitle>
                <CardDescription>Monitor your linked students</CardDescription>
              </div>
              <Link href="/children">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemoMode ? (
                parentChildren.map((child) => (
                  <Link key={child.id} href={`/children/${child.id}`}>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4 hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">{child.name}</h4>
                          <p className="text-xs text-muted-foreground">Class {child.className}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {child.latestResult}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No children linked yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results — Tree: Assessment, Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your child&apos;s latest graded assessments</CardDescription>
              </div>
              <Link href="/results">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemoMode ? (
                parentRecentResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{result.assessment}</h4>
                      <p className="text-xs text-muted-foreground">{result.subject} • {result.date}</p>
                    </div>
                    <Badge
                      variant={result.score >= 80 ? 'secondary' : 'outline'}
                      className={`text-sm font-extrabold ${result.score >= 80 ? 'bg-emerald-500/15 text-emerald-600' : 'text-amber-500 border-amber-500/30'}`}
                    >
                      {result.score}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No results yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
