'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { getMockAssessments, MockAssessment } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';
import { useFetchData } from '@/lib/use-fetch-data';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Clock, CheckCircle2, BookOpen, Loader2, BarChart3 } from 'lucide-react';

interface LiveAssessment {
  id: string;
  title: string;
  type: string;
  dueAt?: string;
  questions?: unknown[];
  submissionsCount?: number;
  avgScore?: number;
}

function toDisplayItem(a: LiveAssessment, _role: string): MockAssessment {
  return {
    id: a.id,
    title: a.title,
    type: a.type as MockAssessment['type'],
    subject: '—',
    due: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : 'No due date',
    questionsCount: a.questions?.length ?? 0,
    points: 0,
    status: 'AVAILABLE',
    submissionsCount: a.submissionsCount,
  };
}

export default function AssessmentsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('ALL');

  const currentRole = user?.role || activeRole;

  // Fetch live data for authenticated (non-demo) users
  const shouldFetchLive = !isDemoMode && (currentRole === 'TEACHER' || currentRole === 'STUDENT');
  const liveEndpoint =
    currentRole === 'TEACHER' ? '/assessments/teacher' : currentRole === 'STUDENT' ? '/assessments/student' : null;

  const { data: liveData, isLoading: isLoadingLive, error: liveFetchError } = useFetchData<MockAssessment[]>(
    () =>
      apiClient.get<LiveAssessment[]>(liveEndpoint!).then((res) => {
        const raw: LiveAssessment[] = Array.isArray(res.data) ? res.data : [];
        return raw.map((a) => toDisplayItem(a, currentRole));
      }),
    [currentRole],
    shouldFetchLive && !!liveEndpoint,
  );
  const liveItems = liveData ?? [];

  // Source: mock data in demo mode, live data otherwise
  const sourceItems = isDemoMode ? getMockAssessments(currentRole) : liveItems;

  const filtered = sourceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const actionLabel = (item: MockAssessment) => {
    if (currentRole === 'TEACHER') return 'Manage Questions';
    if (currentRole === 'PARENT') return 'View Results';
    return item.status === 'SUBMITTED' || item.status === 'GRADED' ? 'Review Score' : 'Start Assessment';
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentRole === 'TEACHER' ? 'My Assessments' : 'Assessments & Quizzes'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentRole === 'TEACHER'
              ? 'Manage and publish your assessments, quizzes, and exams'
              : currentRole === 'PARENT'
              ? "Browse your child's assessment results and upcoming tests"
              : 'Browse, practice, or start your class assessments'}
          </p>
        </div>

        {currentRole === 'TEACHER' && (
          <Link href="/assessments/new">
            <Button variant="role" className="shadow-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by title or subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'QUIZ', 'EXAM', 'ASSIGNMENT'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'role' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize text-xs"
              >
                {type.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading / Error states (live mode only) */}
      {!isDemoMode && isLoadingLive && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading assessments…</span>
        </div>
      )}
      {!isDemoMode && liveFetchError && !isLoadingLive && (
        <div className="py-10 text-center text-xs text-destructive">
          Failed to load assessments. Please refresh the page.
        </div>
      )}

      {/* Assessment Grid */}
      {(!isLoadingLive || isDemoMode) && !liveFetchError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-2 py-14 text-center text-muted-foreground text-sm">
              No assessments match your search.
            </div>
          ) : (
            filtered.map((item) => (
              <Card key={item.id} className="relative flex flex-col justify-between hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">{item.subject}</span>
                    </div>

                    {/* Status badge */}
                    {currentRole !== 'TEACHER' && (
                      item.status === 'SUBMITTED' || item.status === 'GRADED' ? (
                        <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.status === 'GRADED' ? 'Graded' : 'Submitted'}</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Active</span>
                        </Badge>
                      )
                    )}

                    {/* Teacher: submissions count */}
                    {currentRole === 'TEACHER' && item.submissionsCount !== undefined && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 gap-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>{item.submissionsCount} submissions</span>
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Due: {item.due}
                    {item.questionsCount > 0 && ` • ${item.questionsCount} Questions`}
                    {item.points > 0 && ` • ${item.points} Points`}
                    {currentRole === 'TEACHER' && item.avgScore !== undefined && (
                      <span className="text-emerald-600 font-semibold"> • Avg: {item.avgScore}%</span>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Auto-Graded MCQ</span>
                  </div>
                  <Link href={`/assessments/${item.id}`}>
                    <Button variant="role" size="sm">
                      {actionLabel(item)}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
