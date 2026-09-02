"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  getMockParentChildrenDetail,
  MockParentChildDetail,
} from "@/lib/mock-data";
import { parentStudentsApi } from "@/lib/api-client";
import { useFetchData } from "@/lib/use-fetch-data";
import { User } from "@/types";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  FileCheck2,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function ChildrenPage() {
  const { user, isDemoMode } = useAuthStore();

  const { data: liveChildrenData, isLoading } = useFetchData<User[]>(
    () =>
      parentStudentsApi
        .getChildren(user?.id)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
    [user?.id],
    !isDemoMode,
  );
  const liveChildren = liveChildrenData ?? [];

  const mockChildren = getMockParentChildrenDetail();

  const displayChildren: MockParentChildDetail[] = isDemoMode
    ? mockChildren
    : liveChildren.map((c, idx) => ({
        ...mockChildren[idx],
        id: c.id,
        name: c.name || mockChildren[idx]?.name || "Unknown",
      }));

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Children
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor linked students and open their assessment history
        </p>
      </div>

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading children…</span>
        </div>
      )}

      {/* Children List */}
      {(!isLoading || isDemoMode) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayChildren.length === 0 ? (
            <Card className="col-span-2 py-14 text-center text-sm text-muted-foreground">
              No children linked to your account yet.
            </Card>
          ) : (
            displayChildren.map((child) => (
              <Card
                key={child.id}
                className="hover:border-primary/50 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{child.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Class {child.className}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="role" className="text-xs">
                      Grade 8
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2 border-t border-border/40 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck2 className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Assessments
                        </p>
                        <p className="font-bold text-foreground">
                          {child.assessmentCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="font-bold text-amber-600 dark:text-amber-400">
                          {child.average}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/children/${child.id}`}>
                    <Button variant="role" size="sm" className="w-full">
                      View Assessment Results
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
