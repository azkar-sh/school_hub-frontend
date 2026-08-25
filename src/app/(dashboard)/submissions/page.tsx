'use client';

import * as React from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, CheckCircle2, Clock, Award, UserCheck } from 'lucide-react';

export default function SubmissionsPage() {
  const { user } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  const mockSubmissions = [
    { id: 'sub-1', studentName: 'Alex Rivera', assessmentTitle: 'Mathematics Midterm Algebra Quiz', score: 100, submittedAt: '2026-08-25 14:30', status: 'GRADED' },
    { id: 'sub-2', studentName: 'Jordan Smith', assessmentTitle: 'Mathematics Midterm Algebra Quiz', score: 85, submittedAt: '2026-08-25 13:15', status: 'GRADED' },
    { id: 'sub-3', studentName: 'Emily Chen', assessmentTitle: 'Physics Fundamentals & Mechanics Exam', score: 92, submittedAt: '2026-08-24 16:45', status: 'GRADED' },
    { id: 'sub-4', studentName: 'Liam Wilson', assessmentTitle: 'Biology Cell Structure Assignment', score: null, submittedAt: '2026-08-25 11:20', status: 'SUBMITTED' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Submissions & Grading Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Review student answer submissions, grades, and completion metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span>Recent Student Submissions</span>
          </CardTitle>
          <CardDescription>All submitted assessments across classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground bg-muted/50 rounded-xl">
                <tr>
                  <th className="p-3 font-semibold rounded-l-xl">Student</th>
                  <th className="p-3 font-semibold">Assessment Title</th>
                  <th className="p-3 font-semibold">Submitted At</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right rounded-r-xl">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {mockSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-medium flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" />
                      <span>{sub.studentName}</span>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">{sub.assessmentTitle}</td>
                    <td className="p-3.5 text-xs text-muted-foreground">{sub.submittedAt}</td>
                    <td className="p-3.5">
                      {sub.status === 'GRADED' ? (
                        <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
                          Graded
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                          Pending Review
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-base text-foreground">
                      {sub.score !== null ? `${sub.score}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
