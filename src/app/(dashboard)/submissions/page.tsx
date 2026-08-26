'use client';

import * as React from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { getMockSubmissions, MockSubmission } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, CheckCircle2, Clock, UserCheck, Loader2 } from 'lucide-react';

export default function SubmissionsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  const [liveSubmissions, setLiveSubmissions] = React.useState<MockSubmission[]>([]);
  const [isLoadingLive, setIsLoadingLive] = React.useState(false);
  const [liveFetchError, setLiveFetchError] = React.useState(false);

  // Live fetch for authenticated (non-demo) users
  React.useEffect(() => {
    if (isDemoMode) return;
    if (!user?.id) return;

    setIsLoadingLive(true);
    setLiveFetchError(false);

    // For students and parents: fetch their own submissions.
    // For teachers: we don't have a list-all-submissions endpoint here,
    // so we fall through gracefully with an empty list.
    const endpoint = currentRole === 'STUDENT' ? `/submissions` : null;
    if (!endpoint) {
      setIsLoadingLive(false);
      return;
    }

    apiClient
      .get(endpoint)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped: MockSubmission[] = raw.map((s: any) => ({
          id: s.id,
          studentName: s.student?.name ?? user?.name ?? 'You',
          assessmentTitle: s.assessment?.title ?? 'Assessment',
          subject: s.assessment?.subject ?? '—',
          score: s.score ?? null,
          submittedAt: s.submittedAt
            ? new Date(s.submittedAt).toLocaleString()
            : s.startedAt
            ? new Date(s.startedAt).toLocaleString()
            : '—',
          status: s.status === 'GRADED' ? 'GRADED' : 'SUBMITTED',
        }));
        setLiveSubmissions(mapped);
      })
      .catch(() => setLiveFetchError(true))
      .finally(() => setIsLoadingLive(false));
  }, [isDemoMode, currentRole, user?.id]);

  const displaySubmissions = isDemoMode ? getMockSubmissions(currentRole) : liveSubmissions;

  const pageTitle =
    currentRole === 'TEACHER'
      ? 'Student Submissions & Grading Hub'
      : currentRole === 'PARENT'
      ? "Child's Submission History"
      : 'My Submission History';

  const pageDescription =
    currentRole === 'TEACHER'
      ? 'Review all student answer submissions, grades, and completion metrics'
      : currentRole === 'PARENT'
      ? "Track your child's quiz attempts, scores, and grading status"
      : 'Your past quiz attempts, submitted assignments, and graded results';

  const tableTitle =
    currentRole === 'TEACHER'
      ? 'Recent Student Submissions'
      : currentRole === 'PARENT'
      ? "Alex Rivera's Submissions"
      : 'Your Submissions';

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span>{tableTitle}</span>
          </CardTitle>
          <CardDescription>
            {currentRole === 'TEACHER'
              ? 'All submitted assessments across your classes'
              : 'All assessments you have attempted'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading state */}
          {!isDemoMode && isLoadingLive && (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading submissions…</span>
            </div>
          )}

          {/* Error state */}
          {!isDemoMode && liveFetchError && !isLoadingLive && (
            <div className="py-8 text-center text-xs text-destructive">
              Failed to load submissions. Please refresh the page.
            </div>
          )}

          {/* Empty state for real teachers (no list endpoint yet) */}
          {!isDemoMode && !isLoadingLive && !liveFetchError && currentRole === 'TEACHER' && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Individual submission grading is available via the assessment detail page.
            </div>
          )}

          {/* Data table */}
          {(isDemoMode || (!isLoadingLive && !liveFetchError && currentRole !== 'TEACHER')) &&
            displaySubmissions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-muted-foreground bg-muted/50 rounded-xl">
                    <tr>
                      <th className="p-3 font-semibold rounded-l-xl">
                        {currentRole === 'TEACHER' ? 'Student' : 'Assessment'}
                      </th>
                      <th className="p-3 font-semibold">
                        {currentRole === 'TEACHER' ? 'Assessment Title' : 'Subject'}
                      </th>
                      <th className="p-3 font-semibold">Submitted At</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right rounded-r-xl">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {displaySubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-medium">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-primary shrink-0" />
                            <span>
                              {currentRole === 'TEACHER' ? sub.studentName : sub.assessmentTitle}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-foreground">
                          {currentRole === 'TEACHER' ? sub.assessmentTitle : sub.subject}
                        </td>
                        <td className="p-3.5 text-xs text-muted-foreground">{sub.submittedAt}</td>
                        <td className="p-3.5">
                          {sub.status === 'GRADED' ? (
                            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Graded
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1">
                              <Clock className="w-3 h-3" />
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
            )}

          {(isDemoMode || (!isLoadingLive && !liveFetchError)) &&
            displaySubmissions.length === 0 &&
            currentRole !== 'TEACHER' && (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No submissions found yet.
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
