"use client";

import * as React from "react";
import { useSchoolSelection } from "@/lib/use-school-selection";
import { useAuthStore } from "@/stores/use-auth-store";
import { useFetchData } from "@/lib/use-fetch-data";
import { academicYearsApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { AcademicYear } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Calendar,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  Clock,
  ArrowRight,
  X,
  Building2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AcademicYearsPage() {
  const t = useTranslations("AcademicYears");
  const { isDemoMode } = useAuthStore();
  const { schools, selectedSchoolId, setSelectedSchoolId } = useSchoolSelection();

  // Search & Modal State
  const [search, setSearch] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Fetch Academic Years
  const {
    data: academicYearsData,
    isLoading,
    error: isError,
    refetch,
  } = useFetchData(
    () =>
      academicYearsApi
        .findBySchool(selectedSchoolId)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [selectedSchoolId],
    !isDemoMode && !!selectedSchoolId,
  );

  const academicYearsList = (academicYearsData ?? []) as AcademicYear[];

  // Filtered Academic Years
  const filteredYears = React.useMemo(() => {
    if (!search.trim()) return academicYearsList;
    const q = search.toLowerCase();
    return academicYearsList.filter((item) =>
      item.name.toLowerCase().includes(q),
    );
  }, [academicYearsList, search]);

  // Form submission handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startsAt || !endsAt || !selectedSchoolId) return;

    try {
      setIsSubmitting(true);
      setFeedbackMsg(null);

      await academicYearsApi.create({
        schoolId: selectedSchoolId,
        name: name.trim(),
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      });

      setName("");
      setStartsAt("");
      setEndsAt("");
      setShowModal(false);
      setFeedbackMsg("Academic year created successfully!");
      refetch();
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create academic year"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {schools.length > 1 && (
            <select
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <Button
            variant="role"
            onClick={() => setShowModal(true)}
            className="gap-2 rounded-xl shadow-md font-semibold shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("newAcademicYear")}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold animate-in fade-in duration-200 ${
            feedbackMsg.toLowerCase().includes("failed") ||
            feedbackMsg.toLowerCase().includes("error")
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {feedbackMsg.toLowerCase().includes("failed") ||
          feedbackMsg.toLowerCase().includes("error") ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="pl-10 h-11 rounded-xl bg-card border-border/60 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Academic Years List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading academic years...</span>
        </div>
      ) : isError && !isDemoMode ? (
        <Card className="rounded-2xl border-destructive/20 bg-destructive/5 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-destructive">
                Failed to load academic years
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                An error occurred while fetching academic years. Please try again.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="mt-2 rounded-xl text-xs"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredYears.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/40 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                No Academic Years Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Get started by creating your school&apos;s first academic year.
              </p>
            </div>
            <Button
              variant="role"
              size="sm"
              onClick={() => setShowModal(true)}
              className="mt-2 gap-2 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("createAcademicYear")}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredYears.map((ay) => {
            const isActive = ay.isActive ?? true;
            return (
              <Card
                key={ay.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          {ay.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>SMA Cendekia Bangsa</span>
                        </CardDescription>
                      </div>
                    </div>
                    {isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 gap-1.5 font-semibold text-xs px-2.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("active")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs">
                        {t("inactive")}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-2 space-y-4">
                  {/* Date Range Box */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t("startDate")}:
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatDate(ay.startsAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t("endDate")}:
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatDate(ay.endsAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-1 flex items-center justify-between border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-medium">Active Terms</span>
                    </div>

                    <Link
                      href="/classes"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Manage Classes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Academic Year Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {t("createAcademicYear")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("description")}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block text-foreground">
                  {t("name")}
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("yearPlaceholder")}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block text-foreground">
                  {t("startDate")}
                </label>
                <Input
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block text-foreground">
                  {t("endDate")}
                </label>
                <Input
                  type="date"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="role"
                  disabled={isSubmitting}
                  className="rounded-xl font-semibold gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{t("createAcademicYear")}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
