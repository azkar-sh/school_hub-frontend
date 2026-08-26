'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { getMockSubjects } from '@/lib/mock-data';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Layers, BookmarkCheck, PlusCircle } from 'lucide-react';

export default function SubjectsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  // Subjects/Topics pages use mock data only (requires schoolId — future integration)
  const subjects = getMockSubjects(currentRole);

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Subjects & Topic Hierarchy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentRole === 'TEACHER'
              ? 'Manage curriculum breakdown, add topics, and organize subtopics'
              : 'Explore curriculum breakdown, topics, and subtopics'}
          </p>
        </div>

        {/* Teachers can add new subjects */}
        {currentRole === 'TEACHER' && (
          <Button variant="role" className="shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {subjects.map((sub) => (
          <Card key={sub.id} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{sub.name}</CardTitle>
                    <Badge variant="outline">{sub.code}</Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    {sub.topics.length} Major Topics
                  </CardDescription>
                </div>
              </div>

              {/* Teacher: add topic button */}
              {sub.canEdit && (
                <Button variant="outline" size="sm" className="text-xs">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  Add Topic
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sub.topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <Layers className="w-4 h-4 text-primary" />
                        <span>{t.name}</span>
                      </div>
                      {/* Teacher: add sub-topic */}
                      {sub.canEdit && (
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground hover:text-primary">
                          <PlusCircle className="w-3 h-3 mr-1" />
                          Sub-topic
                        </Button>
                      )}
                    </div>
                    <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                      {t.subTopics.map((st, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
