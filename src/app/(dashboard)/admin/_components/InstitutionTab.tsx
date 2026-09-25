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
  Building2,
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  PlusCircle,
  Sparkles,
  ArrowRight,
  School as SchoolIcon,
} from "lucide-react";
import { School, User } from "@/types";
import Link from "next/link";

interface InstitutionTabProps {
  school: School & {
    _count?: { members?: number; classes?: number };
    academicYears?: Array<{ id: string; name: string; isActive: boolean }>;
    subjects?: Array<{ id: string; name: string; code: string }>;
  };
  schools: School[];
  selectedSchoolId: string;
  onSelectSchool: (id: string) => void;
  onOpenCreateSchool: () => void;
  currentUser: User | null;
}

export function InstitutionTab({
  school,
  schools,
  selectedSchoolId,
  onSelectSchool,
  onOpenCreateSchool,
  currentUser,
}: InstitutionTabProps) {
  const [copiedId, setCopiedId] = React.useState(false);

  const copySchoolId = () => {
    if (!school?.id) return;
    navigator.clipboard.writeText(school.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const memberCount = school?._count?.members ?? 0;
  const classCount = school?._count?.classes ?? 0;
  const subjectCount = school?.subjects?.length ?? 0;
  const activeYear =
    school?.academicYears?.find((ay) => ay.isActive)?.name ?? "2026/2027";

  return (
    <div className="space-y-6">
      {/* Institution Hero */}
      <Card className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.03] overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-inner">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {school?.name || "School Institution"}
                  </h2>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 gap-1 font-semibold text-xs py-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Institution
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded-lg border border-border/40 select-all">
                    {school?.id}
                  </span>
                  <button
                    onClick={copySchoolId}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/10"
                    title="Copy School ID"
                  >
                    {copiedId ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/classes">
                <Button
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5 font-semibold"
                >
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Classes Hub</span>
                </Button>
              </Link>
              <Link href="/members">
                <Button
                  variant="role"
                  className="rounded-xl text-xs gap-1.5 font-semibold shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Members</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                School Members
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {memberCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Teachers, Admins & Students
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Class Sections
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {classCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Active cohorts & homerooms
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registered Subjects
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {subjectCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Curricula & Syllabus Topics
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Academic Year
              </p>
              <h3 className="text-xl font-bold mt-1 text-foreground">
                {activeYear}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Currently In Session
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Multi-Campus Network & Governance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campus Network (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <SchoolIcon className="w-4 h-4 text-primary" />
                <span>Multi-Campus Network</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Registered institutional campuses in this organization.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCreateSchool}
              className="gap-1.5 rounded-xl text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span>Add Campus</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schools.map((s) => {
              const isSelected = s.id === selectedSchoolId;
              return (
                <Card
                  key={s.id}
                  onClick={() => onSelectSchool(s.id)}
                  className={`cursor-pointer transition-all duration-200 rounded-2xl border p-4 ${
                    isSelected
                      ? "border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary/20"
                      : "border-border/60 bg-card hover:border-border hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {s.name}
                        </h4>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {s.id}
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <Badge className="bg-primary text-primary-foreground text-[10px] shrink-0 font-semibold">
                        Active Context
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-primary"
                      >
                        Switch
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Administrator Profile (1 column) */}
        <Card className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/40">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">
              Administrator Authority
            </h4>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/[0.04] border border-primary/20">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary font-black text-sm flex items-center justify-center">
              {currentUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground truncate">
                {currentUser?.name || "School Administrator"}
              </h4>
              <p className="text-[11px] text-muted-foreground font-mono truncate">
                {currentUser?.email || "admin@learnhub.com"}
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold">
              Admin
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
            <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
              Governance Scope:
            </p>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-foreground/80">
              <li>Institutional Profile & Campus Branches</li>
              <li>Academic Terms & Session Calendars</li>
              <li>Homeroom & Teacher Assignments</li>
              <li>Parent-Student Guardianship Links</li>
              <li>Master Subject Catalog Registry</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
