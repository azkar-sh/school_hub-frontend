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
import { Input } from "@/components/ui/input";
import {
  HeartHandshake,
  Search,
  UserPlus,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { ParentRelationship, ParentStudent, User } from "@/types";

interface GuardianshipTabProps {
  links: ParentStudent[];
  totalParents: number;
  totalStudents: number;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenLinkModal: () => void;
  onUnlink: (parentId: string, studentId: string) => void;
  isLoading: boolean;
}

export function GuardianshipTab({
  links,
  totalParents,
  totalStudents,
  search,
  onSearchChange,
  onOpenLinkModal,
  onUnlink,
  isLoading,
}: GuardianshipTabProps) {
  const getRelationshipBadge = (rel: ParentRelationship) => {
    switch (rel) {
      case "FATHER":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold text-xs px-2.5 py-0.5">
            Ayah (Father)
          </Badge>
        );
      case "MOTHER":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold text-xs px-2.5 py-0.5">
            Ibu (Mother)
          </Badge>
        );
      case "GUARDIAN":
      default:
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-xs px-2.5 py-0.5">
            Wali (Guardian)
          </Badge>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Active";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const distinctParentsInLinks = React.useMemo(() => {
    const ids = new Set(links.map((l) => l.parentId));
    return ids.size;
  }, [links]);

  const distinctStudentsInLinks = React.useMemo(() => {
    const ids = new Set(links.map((l) => l.studentId));
    return ids.size;
  }, [links]);

  const displayTotalParents = totalParents > 0 ? totalParents : distinctParentsInLinks;
  const displayTotalStudents = totalStudents > 0 ? totalStudents : distinctStudentsInLinks;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Parents
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {displayTotalParents}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Registered parent accounts
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
                Total Students
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {displayTotalStudents}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Enrolled student accounts
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Established Links
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {links.length}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Verified family connections
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by parent, student, or relationship..."
            className="pl-10 h-11 rounded-xl bg-card border-border/60 focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm"
          />
        </div>

        <Button
          variant="role"
          onClick={onOpenLinkModal}
          className="gap-2 rounded-xl shadow-md font-semibold text-xs sm:text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Link Guardian</span>
        </Button>
      </div>

      {/* Directory of Links */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading guardian relationships...</span>
        </div>
      ) : links.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/40 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                No Guardian Links Established
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Connect parent accounts with their student wards so parents can monitor attendance, assignments, and grades.
              </p>
            </div>
            <Button
              variant="role"
              size="sm"
              onClick={onOpenLinkModal}
              className="mt-2 gap-2 rounded-xl"
            >
              <UserPlus className="w-4 h-4" />
              <span>Link Guardian to Student</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => {
            const parentInitial = link.parent?.name?.charAt(0).toUpperCase() || "P";
            const studentInitial = link.student?.name?.charAt(0).toUpperCase() || "S";

            return (
              <Card
                key={`${link.parentId}-${link.studentId}`}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <CardHeader className="p-4 pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Guardianship Relation
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getRelationshipBadge(link.relationship)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnlink(link.parentId, link.studentId)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Unlink relationship"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Parent Info */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Parent / Guardian
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {parentInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {link.parent?.name || "Parent Account"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {link.parent?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Student / Ward
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {studentInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {link.student?.name || "Student Account"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {link.student?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      Linked on {formatDate(link.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Record
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
