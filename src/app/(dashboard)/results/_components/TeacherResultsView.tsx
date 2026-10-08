import * as React from "react";
import { getMockTeacherSubjectResults } from "@/lib/mock-data";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  UserRound,
  Loader2,
  Award,
  ArrowRight,
  X,
  CalendarDays,
} from "lucide-react";
import {
  TeacherSubjectResult,
  TeacherStudentResult,
} from "../hooks";
import { useTranslations } from "next-intl";

interface TeacherResultsViewProps {
  isDemoMode: boolean;
  isLoading: boolean;
  teacherSubjects: TeacherSubjectResult[];
}

function scoreColor(pct: number | null) {
  if (pct === null) return "text-muted-foreground";
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

function scoreBadgeClass(pct: number | null) {
  if (pct === null) return "border-border/50 bg-muted/40 text-muted-foreground";
  if (pct >= 80)
    return "border-success/30 bg-success/15 text-success";
  if (pct >= 60)
    return "border-warning/30 bg-warning/15 text-warning";
  return "border-destructive/30 bg-destructive/15 text-destructive";
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

export function TeacherResultsView({
  isDemoMode,
  isLoading,
  teacherSubjects,
}: TeacherResultsViewProps) {
  const t = useTranslations("Results");
  const [subjectFilter, setSubjectFilter] = React.useState("ALL");
  const [classFilter, setClassFilter] = React.useState("ALL");
  const [selectedStudent, setSelectedStudent] =
    React.useState<TeacherStudentResult | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] =
    React.useState<string>("");

  const mockSubjects = getMockTeacherSubjectResults();
  const sourceSubjects: TeacherSubjectResult[] = isDemoMode
    ? mockSubjects
    : teacherSubjects;

  // Filter options derived from the full dataset.
  const subjectOptions = sourceSubjects.map((s) => ({
    id: s.subjectId,
    name: s.subjectName,
  }));
  const classOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    sourceSubjects.forEach((subj) => {
      subj.students.forEach((stu) => {
        stu.assessments.forEach((a) => {
          if (a.classId && a.classId !== "unknown") {
            map.set(a.classId, a.className);
          }
        });
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [sourceSubjects]);

  // Apply filters + recompute averages against the filtered set.
  const filteredSubjects: TeacherSubjectResult[] = React.useMemo(() => {
    const result: TeacherSubjectResult[] = [];

    sourceSubjects.forEach((subj) => {
      if (subjectFilter !== "ALL" && subj.subjectId !== subjectFilter) return;

      const students: TeacherStudentResult[] = [];
      const allScores: number[] = [];

      subj.students.forEach((stu) => {
        const assessments =
          classFilter === "ALL"
            ? stu.assessments
            : stu.assessments.filter((a) => a.classId === classFilter);
        if (assessments.length === 0) return;

        const scored = assessments
          .map((a) => a.scorePercentage)
          .filter((v): v is number => v !== null);
        allScores.push(...scored);

        students.push({
          ...stu,
          assessments,
          assessmentCount: assessments.length,
          averageScore: avg(scored),
        });
      });

      if (students.length === 0) return;

      result.push({
        ...subj,
        students,
        studentCount: students.length,
        averageScore: avg(allScores),
      });
    });

    return result;
  }, [sourceSubjects, subjectFilter, classFilter]);

  const openStudent = (stu: TeacherStudentResult, subjectName: string) => {
    setSelectedStudent(stu);
    setSelectedSubjectName(subjectName);
  };

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("teacherTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("teacherSubtitle")}
        </p>
      </div>

      {/* Filters — Tree: Subject Filter, Class Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              {t("subject")}
            </label>
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="ALL">{t("allSubjects")}</option>
              {subjectOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:flex-1">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              {t("class")}
            </label>
            <select
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="ALL">{t("allClasses")}</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingResults")}</span>
        </div>
      )}

      {/* Subject grouping — Tree: Subject (avg) -> Students (avg) */}
      {(!isLoading || isDemoMode) && (
        <>
          {filteredSubjects.length === 0 ? (
            <Card className="py-14 text-center text-sm text-muted-foreground">
              {t("noResultsFound")}
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredSubjects.map((subject) => (
                <Card key={subject.subjectId} className="border-border/60">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            {subject.subjectName}
                          </CardTitle>
                          <Badge variant="outline" className="text-[10px]">
                            {subject.subjectCode}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs mt-0.5">
                          {subject.studentCount}{" "}
                          {subject.studentCount !== 1
                            ? t("students")
                            : t("student")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        {t("average")}
                      </span>
                      <span
                        className={`text-2xl font-black ${scoreColor(subject.averageScore)}`}
                      >
                        {subject.averageScore}%
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                        <tr>
                          <th className="p-3 font-semibold rounded-l-xl">
                            {t("student")}
                          </th>
                          <th className="p-3 font-semibold">
                            {t("assessments")}
                          </th>
                          <th className="p-3 font-semibold text-right rounded-r-xl">
                            {t("average")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {subject.students.map((stu) => (
                          <tr
                            key={stu.studentId}
                            onClick={() => openStudent(stu, subject.subjectName)}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <td className="p-3.5 font-medium">
                              <div className="flex items-center gap-2">
                                <UserRound className="w-4 h-4 text-primary shrink-0" />
                                <span>{stu.studentName}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-muted-foreground">
                              {stu.assessmentCount}
                            </td>
                            <td className="p-3.5 text-right">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={`font-extrabold text-base ${scoreColor(stu.averageScore)}`}
                                >
                                  {stu.averageScore}%
                                </span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Student Detail Modal — Tree: Assessment, Grade */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <Card
            className="w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50">
              <div>
                <CardTitle className="text-lg">
                  {selectedStudent.studentName}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {selectedSubjectName} • {selectedStudent.assessmentCount}{" "}
                  {selectedStudent.assessmentCount !== 1
                    ? t("assessments")
                    : t("subject")}
                </CardDescription>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {/* Student average */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Award className="w-4 h-4 text-primary" />
                  {t("average")}
                </div>
                <span
                  className={`text-3xl font-black ${scoreColor(selectedStudent.averageScore)}`}
                >
                  {selectedStudent.averageScore}%
                </span>
              </div>

              {/* Assessment list */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("assessments")}
                </p>
                {selectedStudent.assessments.map((a) => {
                  const date = formatDate(a.submittedAt);
                  return (
                    <div
                      key={a.submissionId}
                      className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="truncate font-semibold text-sm text-foreground">
                          {a.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase"
                          >
                            {a.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[10px]"
                          >
                            {a.className}
                          </Badge>
                          {date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {date}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-sm font-extrabold shrink-0 ${scoreBadgeClass(a.scorePercentage)}`}
                      >
                        {a.scorePercentage !== null
                          ? `${a.scorePercentage}%`
                          : t("pending")}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
