'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, FileCheck2, Clock, CheckCircle2, BookOpen } from 'lucide-react';

export default function AssessmentsPage() {
  const { user } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('ALL');

  const currentRole = user?.role || activeRole;

  const mockAssessments = [
    { id: '1', title: 'Mathematics Midterm Algebra Quiz', type: 'QUIZ', subject: 'Algebra I', due: '2026-08-30', questionsCount: 10, points: 100, status: 'AVAILABLE' },
    { id: '2', title: 'Physics Fundamentals & Mechanics Exam', type: 'EXAM', subject: 'Physics', due: '2026-09-05', questionsCount: 15, points: 150, status: 'AVAILABLE' },
    { id: '3', title: 'Biology Cell Structure & Photosynthesis Assignment', type: 'ASSIGNMENT', subject: 'Biology', due: '2026-08-20', questionsCount: 5, points: 50, status: 'SUBMITTED' },
    { id: '4', title: 'World History Ancient Empires Quiz', type: 'QUIZ', subject: 'History', due: '2026-09-01', questionsCount: 8, points: 80, status: 'AVAILABLE' },
    { id: '5', title: 'Chemistry Chemical Reactions Lab Test', type: 'EXAM', subject: 'Chemistry', due: '2026-09-10', questionsCount: 12, points: 120, status: 'AVAILABLE' },
  ];

  const filtered = mockAssessments.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Assessments & Quizzes</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse, practice, or manage school assessments</p>
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
              placeholder="Search by title or subject..."
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

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <Card key={item.id} className="relative flex flex-col justify-between hover:border-primary/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {item.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">{item.subject}</span>
                </div>
                {item.status === 'SUBMITTED' ? (
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Active</span>
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Due: {item.due} • {item.questionsCount} Questions • {item.points} Points
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 flex items-center justify-between border-t border-border/40 pt-4 mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Auto-Graded MCQ</span>
              </div>
              <Link href={`/assessments/${item.id}`}>
                <Button variant="role" size="sm">
                  {currentRole === 'STUDENT' ? (item.status === 'SUBMITTED' ? 'Review Score' : 'Start Assessment') : 'Manage Questions'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
