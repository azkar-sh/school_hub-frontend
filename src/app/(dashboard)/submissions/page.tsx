"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubmissions } from "@/lib/mock-data";
import { submissionsApi, parentStudentsApi } from "@/lib/api-client";
import { Submission } from "@/types";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Edit3,
  X,
} from "lucide-react";

export default function SubmissionsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  const [searchSubId, setSearchSubId] = React.useState("");
  const [activeSubmissionDetail, setActiveSubmissionDetail] =
    React.useState<Submission | null>(null);

  const [isLoadingLive, setIsLoadingLive] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Manual grading state for teachers
  const [gradeAnswerId, setGradeAnswerId] = React.useState("");
  const [gradePoints, setGradePoints] = React.useState<number>(10);

  // Live fetch for parents (fetch child wards) and lookup
  React.useEffect(() => {
    if (isDemoMode) return;
    if (currentRole === "PARENT") {
      parentStudentsApi.getChildren().catch(() => {});
    }
  }, [isDemoMode, currentRole]);

  const handleLookupSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchSubId.trim()) return;
    try {
      setIsLoadingLive(true);
      const res = await submissionsApi.findOne(searchSubId.trim());
      setActiveSubmissionDetail(res.data);
    } catch {
      setFeedbackMsg("Failed to find submission with specified ID");
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionDetail || !gradeAnswerId) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Grade updated in demo mode");
        return;
      }
      await submissionsApi.grade(activeSubmissionDetail.id, {
        grades: [
          { answerId: gradeAnswerId, pointsEarned: Number(gradePoints) || 0 },
        ],
      });
      setFeedbackMsg("Submission grade updated successfully!");
      // Reload submission detail
      const updated = await submissionsApi.findOne(activeSubmissionDetail.id);
      setActiveSubmissionDetail(updated.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to grade submission";
      setFeedbackMsg(message);
    }
  };

  const displaySubmissions = getMockSubmissions(currentRole);

  const pageTitle =
    currentRole === "TEACHER"
      ? "Student Submissions & Grading Hub"
      : currentRole === "PARENT"
        ? "Child's Submission History"
        : "My Submission History";

  const pageDescription =
    currentRole === "TEACHER"
      ? "Review student answer submissions, grade short answers, and check score metrics"
      : currentRole === "PARENT"
        ? "Track your child's quiz attempts, scores, and grading status"
        : "Your past quiz attempts, submitted assignments, and graded results";

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Submission ID Lookup bar for real users */}
      {!isDemoMode && (
        <Card className="p-4">
          <form
            onSubmit={handleLookupSubmission}
            className="flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Enter Submission UUID to inspect details & grade..."
              value={searchSubId}
              onChange={(e) => setSearchSubId(e.target.value)}
              className="flex-1 text-xs"
            />
            <Button
              type="submit"
              variant="role"
              size="sm"
              isLoading={isLoadingLive}
            >
              Fetch Submission
            </Button>
          </form>
        </Card>
      )}

      {/* Inspected Submission Detail View */}
      {activeSubmissionDetail && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Badge variant="role" className="mb-1">
                Submission Detail ({activeSubmissionDetail.status})
              </Badge>
              <CardTitle className="text-lg">
                {activeSubmissionDetail.assessment?.title ||
                  "Assessment Submission"}
              </CardTitle>
              <CardDescription className="text-xs">
                Student:{" "}
                {activeSubmissionDetail.student?.name ||
                  activeSubmissionDetail.studentId}
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-semibold text-muted-foreground block">
                Score
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {activeSubmissionDetail.score !== undefined &&
                activeSubmissionDetail.score !== null
                  ? `${activeSubmissionDetail.score}%`
                  : "Pending"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Student Answers & Grades
            </h4>
            <div className="space-y-3">
              {activeSubmissionDetail.answers?.map((ans) => (
                <div
                  key={ans.id}
                  className="p-3.5 rounded-xl bg-card border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {ans.question?.question ||
                        `Question ID: ${ans.questionId}`}
                    </p>
                    <p className="text-muted-foreground">
                      Submitted Answer:{" "}
                      <span className="font-bold text-foreground">
                        {ans.answer}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      Points:{" "}
                      {ans.pointsEarned !== undefined
                        ? ans.pointsEarned
                        : "Auto"}
                    </Badge>
                    {currentRole === "TEACHER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[11px]"
                        onClick={() => {
                          setGradeAnswerId(ans.id);
                          setGradePoints(ans.pointsEarned || 10);
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Grade Answer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Teacher Manual Grade Input Form */}
            {gradeAnswerId && currentRole === "TEACHER" && (
              <form
                onSubmit={handleGradeSubmission}
                className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-3"
              >
                <h5 className="font-bold text-xs text-foreground">
                  Grade Answer ({gradeAnswerId})
                </h5>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Points earned"
                    value={gradePoints}
                    onChange={(e) => setGradePoints(Number(e.target.value))}
                    className="w-40 text-xs"
                  />
                  <Button type="submit" variant="role" size="sm">
                    Save Points
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setGradeAnswerId("")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submissions List Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span>
              {currentRole === "TEACHER"
                ? "Recent Submissions Overview"
                : currentRole === "PARENT"
                  ? "Child Wards' Submissions"
                  : "Your Submissions"}
            </span>
          </CardTitle>
          <CardDescription>
            {currentRole === "TEACHER"
              ? "Enter a submission UUID in the search bar above to view & grade short answers"
              : "All completed and graded assessment attempts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displaySubmissions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground bg-muted/50 rounded-xl">
                  <tr>
                    <th className="p-3 font-semibold rounded-l-xl">
                      {currentRole === "TEACHER" ? "Student" : "Assessment"}
                    </th>
                    <th className="p-3 font-semibold">
                      {currentRole === "TEACHER"
                        ? "Assessment Title"
                        : "Subject"}
                    </th>
                    <th className="p-3 font-semibold">Submitted At</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right rounded-r-xl">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {displaySubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3.5 font-medium">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            {currentRole === "TEACHER"
                              ? sub.studentName
                              : sub.assessmentTitle}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        {currentRole === "TEACHER"
                          ? sub.assessmentTitle
                          : sub.subject}
                      </td>
                      <td className="p-3.5 text-xs text-muted-foreground">
                        {sub.submittedAt}
                      </td>
                      <td className="p-3.5">
                        {sub.status === "GRADED" ? (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/15 text-emerald-600 gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Graded
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-500 border-amber-500/30 gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-base text-foreground">
                        {sub.score !== null ? `${sub.score}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
