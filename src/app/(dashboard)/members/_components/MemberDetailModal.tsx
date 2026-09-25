"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserRound,
  Mail,
  X,
  School as SchoolIcon,
  Calendar,
  Hash,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { MockMember } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

interface MemberDetailModalProps {
  member: MockMember;
  isLoadingDetails?: boolean;
  onClose: () => void;
}

export function MemberDetailModal({
  member,
  isLoadingDetails = false,
  onClose,
}: MemberDetailModalProps) {
  const t = useTranslations("Members");
  const [copied, setCopied] = React.useState(false);

  const displayId = member.userId || member.id;

  const handleCopyId = () => {
    if (displayId) {
      navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 shrink-0">
          <div>
            <CardTitle className="text-lg font-bold">
              {t("detailTitle")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("profileInfo")}
            </CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        {/* Scrollable Content Body */}
        <CardContent className="space-y-6 overflow-y-auto p-6">
          {/* Member Banner & Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                <UserRound className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-extrabold text-foreground truncate">
                    {member.name}
                  </h3>
                  <Badge variant="role" className="capitalize text-xs">
                    {member.role.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
                  <span className="truncate">{member.email}</span>
                </p>
              </div>
            </div>
            {isLoadingDetails && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t("loadingDetails")}</span>
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* User / Member ID */}
            <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span>{t("userId")}</span>
              </p>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-mono text-foreground truncate max-w-[130px]">
                  {displayId}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                  title={copied ? t("copied") : t("copyId")}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* School Membership */}
            <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <SchoolIcon className="w-3.5 h-3.5 text-primary" />
                <span>{t("schoolMembership")}</span>
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {member.schoolName}
              </p>
            </div>

            {/* Registration / Joined Date */}
            <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{t("registeredDate")}</span>
              </p>
              <p className="text-xs font-medium text-foreground">
                {formatDate(member.createdAt)}
              </p>
            </div>
          </div>

          {/* Academic Role Details */}
          <div className="space-y-4 pt-2 border-t border-border/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("academicAssignments")}
            </h4>

            {/* TEACHER DETAILS */}
            {member.role === "TEACHER" && (
              <div className="space-y-4">
                {/* Homeroom Assignment Status */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    member.homeroomAssignment
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30 border-border/50"
                  }`}
                >
                  <Award
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      member.homeroomAssignment
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      {t("homeroomRole")}
                    </p>
                    {member.homeroomAssignment ? (
                      <div className="text-xs text-foreground mt-1 space-y-0.5">
                        <p className="font-semibold text-primary">
                          {t("isHomeroom", {
                            className: member.homeroomAssignment.className,
                          })}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {t("gradeLevel", {
                            grade: member.homeroomAssignment.grade,
                          })}{" "}
                          · {member.homeroomAssignment.academicYear}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("notHomeroom")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Teaching Assignments List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>{t("teachingAssignments")}</span>
                    </p>
                    {member.teachingAssignments &&
                      member.teachingAssignments.length > 0 && (
                        <Badge variant="secondary" className="text-[11px] h-5">
                          {t("membersCount", {
                            count: member.teachingAssignments.length,
                          })}
                        </Badge>
                      )}
                  </div>

                  {member.teachingAssignments &&
                  member.teachingAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {member.teachingAssignments.map((ta) => (
                        <div
                          key={ta.id}
                          className="p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/20 transition-colors space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-foreground truncate">
                              {ta.subjectName}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono shrink-0"
                            >
                              {ta.subjectCode}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t("classEnrollment")}:{" "}
                            <span className="font-semibold text-foreground">
                              {ta.className}
                            </span>{" "}
                            ({t("gradeLevel", { grade: ta.grade })})
                          </p>
                          {ta.academicYear && (
                            <p className="text-[11px] text-muted-foreground/80">
                              {ta.academicYear}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                      {t("noTeachingAssignments")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STUDENT DETAILS */}
            {member.role === "STUDENT" && (
              <div className="space-y-4">
                {/* Class Enrollment */}
                <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>{t("classEnrollment")}</span>
                  </p>
                  {member.enrollment ? (
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {t("enrolledIn", {
                            className: member.enrollment.className,
                          })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {t("gradeLevel", { grade: member.enrollment.grade })} ·{" "}
                          {member.enrollment.academicYear}
                        </p>
                      </div>
                      {member.enrollment.enrolledAt && (
                        <p className="text-[11px] text-muted-foreground">
                          {t("enrolledAt", {
                            date: formatDate(member.enrollment.enrolledAt),
                          })}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {t("noEnrollment")}
                    </p>
                  )}
                </div>

                {/* Linked Guardians */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{t("guardians")}</span>
                  </p>
                  {member.guardians && member.guardians.length > 0 ? (
                    <div className="divide-y divide-border/40 border border-border/60 rounded-xl overflow-hidden">
                      {member.guardians.map((g, idx) => (
                        <div
                          key={idx}
                          className="p-3 flex items-center justify-between text-xs bg-card"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate">
                              {g.name}
                            </p>
                            <p className="text-muted-foreground text-[11px] truncate">
                              {g.email}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize shrink-0">
                            {g.relationship.toLowerCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                      {t("noGuardians")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PARENT DETAILS */}
            {member.role === "PARENT" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{t("children")}</span>
                </p>
                {member.children && member.children.length > 0 ? (
                  <div className="divide-y divide-border/40 border border-border/60 rounded-xl overflow-hidden">
                    {member.children.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-3 flex items-center justify-between text-xs bg-card"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {c.name}
                          </p>
                          <p className="text-muted-foreground text-[11px] truncate">
                            {c.email}{" "}
                            {c.className ? `· Class ${c.className}` : ""}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize shrink-0">
                          {c.relationship.toLowerCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                    {t("noChildren")}
                  </div>
                )}
              </div>
            )}

            {/* SCHOOL ADMIN DETAILS */}
            {member.role === "SCHOOL_ADMIN" && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">
                    {t("adminPrivileges")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {t("adminPrivilegesDesc")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
