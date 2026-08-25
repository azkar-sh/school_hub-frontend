'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, Users, GraduationCap, Calendar } from 'lucide-react';

export default function ClassesPage() {
  const mockClasses = [
    { id: 'c1', name: 'Grade 10-A', grade: 10, academicYear: '2025/2026', homeroomTeacher: 'Prof. Sarah Jenkins', studentsCount: 32 },
    { id: 'c2', name: 'Grade 10-B', grade: 10, academicYear: '2025/2026', homeroomTeacher: 'Dr. Robert Vance', studentsCount: 30 },
    { id: 'c3', name: 'Grade 11-A', grade: 11, academicYear: '2025/2026', homeroomTeacher: 'Ms. Elena Rostova', studentsCount: 28 },
    { id: 'c4', name: 'Grade 12-Science', grade: 12, academicYear: '2025/2026', homeroomTeacher: 'Mr. David Miller', studentsCount: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Classes & Academic Years</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage school class sections, student enrollments, and homeroom assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockClasses.map((cls) => (
          <Card key={cls.id} className="hover:border-primary/50 transition-all">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <Badge variant="role" className="mb-2">
                  Grade {cls.grade}
                </Badge>
                <CardTitle className="text-xl">{cls.name}</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Academic Year: {cls.academicYear}
                </CardDescription>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <School className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-sm border-t border-border/40 mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  Homeroom: {cls.homeroomTeacher}
                </span>
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {cls.studentsCount} Students
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
