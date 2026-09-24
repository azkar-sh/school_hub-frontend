"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SubmissionRow } from "@/lib/mock-data";
import {
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { SubmissionCard } from "./SubmissionCard";

interface GroupedSubmissionsViewProps {
  items: SubmissionRow[];
  groupBy: "class" | "assessment";
  currentRole: string;
}

interface GroupData {
  key: string;
  title: string;
  subject?: string;
  items: SubmissionRow[];
  total: number;
  graded: number;
  pending: number;
  avgScore: number | null;
}

export function GroupedSubmissionsView({
  items,
  groupBy,
  currentRole,
}: GroupedSubmissionsViewProps) {
  // Compute groups
  const groups = React.useMemo<GroupData[]>(() => {
    const map = new Map<string, GroupData>();

    items.forEach((item) => {
      const groupKey =
        groupBy === "class"
          ? item.className || "Tanpa Kelas"
          : item.assessmentTitle || "Untitled Assessment";

      let existing = map.get(groupKey);
      if (!existing) {
        existing = {
          key: groupKey,
          title: groupKey,
          subject: item.subject,
          items: [],
          total: 0,
          graded: 0,
          pending: 0,
          avgScore: null,
        };
        map.set(groupKey, existing);
      }

      existing.items.push(item);
      existing.total += 1;
      if (item.status === "GRADED") {
        existing.graded += 1;
      } else {
        existing.pending += 1;
      }
    });

    // Compute averages
    return Array.from(map.values()).map((g) => {
      const scoredItems = g.items.filter((i) => i.score !== null && i.score !== undefined);
      const avg =
        scoredItems.length > 0
          ? Math.round(
              scoredItems.reduce((acc, i) => acc + (i.score ?? 0), 0) /
                scoredItems.length,
            )
          : null;
      return { ...g, avgScore: avg };
    });
  }, [items, groupBy]);

  // Track collapsed groups
  const [collapsedKeys, setCollapsedKeys] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => setCollapsedKeys({});
  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    groups.forEach((g) => (next[g.key] = true));
    setCollapsedKeys(next);
  };

  if (groups.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground bg-card rounded-2xl border border-border/50">
        Tidak ada data pengumpulan yang cocok dengan filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Menampilkan {groups.length}{" "}
          {groupBy === "class" ? "kelompok kelas" : "asesmen"} • Total{" "}
          {items.length} pengumpulan
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2"
            onClick={expandAll}
          >
            Buka Semua
          </Button>
          <span className="text-border">|</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2"
            onClick={collapseAll}
          >
            Tutup Semua
          </Button>
        </div>
      </div>

      {groups.map((group) => {
        const isCollapsed = !!collapsedKeys[group.key];
        const progressPct =
          group.total > 0
            ? Math.round((group.graded / group.total) * 100)
            : 100;

        return (
          <Card
            key={group.key}
            className="border-border/70 overflow-hidden transition-all duration-200 shadow-xs"
          >
            <CardHeader
              className="p-4 cursor-pointer hover:bg-muted/40 transition-colors select-none"
              onClick={() => toggleGroup(group.key)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {groupBy === "class" ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base font-bold">
                        {group.title}
                      </CardTitle>
                      {groupBy === "assessment" && group.subject && (
                        <Badge variant="outline" className="text-[10px]">
                          {group.subject}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span>{group.total} siswa mengumpulkan</span>
                      <span>•</span>
                      {group.pending > 0 ? (
                        <span className="text-warning font-semibold inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {group.pending} belum dinilai
                        </span>
                      ) : (
                        <span className="text-success font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Semua dinilai
                        </span>
                      )}
                      {group.avgScore !== null && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                            <TrendingUp className="w-3 h-3 text-primary" />
                            Rata-rata: {group.avgScore}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="w-32 hidden md:block">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                      <span>Progres</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progressPct === 100 ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(group.key);
                    }}
                    aria-label={isCollapsed ? "Expand group" : "Collapse group"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isCollapsed && (
              <CardContent className="p-4 pt-0 border-t border-border/40 bg-muted/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
                  {group.items.map((item) => (
                    <SubmissionCard
                      key={item.id}
                      currentRole={currentRole}
                      item={item}
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
