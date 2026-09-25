"use client";

import * as React from "react";
import { CheckCircle2, Eye, Mail, UserPlus, UserRound, X, Award, GraduationCap, Users, ChevronRight } from "lucide-react";
import { useMembersPage, ROLE_FILTERS } from "./hooks";
import { MemberDetailModal } from "./_components/MemberDetailModal";
import { AddMemberModal } from "./_components/AddMemberModal";
import { DataDisplay, FilterGroup, DataDisplayTableHeader } from "@/components/ui/DataDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MockMember } from "@/lib/mock-data";
import { useTranslations } from "next-intl";

export default function MembersPage() {
  const t = useTranslations("Members");
  const tCommon = useTranslations("Common");

  const {
    isDemoMode,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    pagination,
    viewMode,
    setViewMode,
    selectedMember,
    setSelectedMember,
    isLoadingDetails,
    handleSelectMember,
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    isLoading,
    usersList,
    feedbackMsg,
    setFeedbackMsg,
    showAddModal,
    setShowAddModal,
    memberUserId,
    setMemberUserId,
    handleAddMember,
    displayMembers,
  } = useMembersPage();

  const formatDate = React.useCallback((dateStr?: string) => {
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
  }, []);

  const renderAcademicSummary = React.useCallback(
    (item: MockMember) => {
      if (item.role === "TEACHER") {
        const isHomeroom = !!item.homeroomAssignment;
        const count = item.teachingAssignments?.length ?? 0;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {isHomeroom && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1 h-5 font-semibold"
              >
                <Award className="w-3 h-3" />
                <span>
                  {t("homeroomRole")} ({item.homeroomAssignment?.className})
                </span>
              </Badge>
            )}
            {count > 0 ? (
              <span className="text-muted-foreground text-xs">
                {count}{" "}
                {count === 1
                  ? t("teachingAssignments").toLowerCase()
                  : t("teachingAssignments").toLowerCase()}
              </span>
            ) : !isHomeroom ? (
              <span className="text-muted-foreground text-xs">—</span>
            ) : null}
          </div>
        );
      }
      if (item.role === "STUDENT") {
        if (item.enrollment) {
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="secondary" className="text-[10px] gap-1 h-5 font-semibold">
                <GraduationCap className="w-3 h-3 text-primary" />
                <span>Class {item.enrollment.className}</span>
              </Badge>
              <span className="text-muted-foreground text-[11px]">
                {t("gradeLevel", { grade: item.enrollment.grade })}
              </span>
            </div>
          );
        }
        return <span className="text-muted-foreground text-xs">—</span>;
      }
      if (item.role === "PARENT") {
        const count = item.children?.length ?? 0;
        if (count > 0) {
          return (
            <span className="text-xs text-foreground font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>
                {count} {count === 1 ? t("student") : t("children").toLowerCase()}
              </span>
            </span>
          );
        }
        return <span className="text-muted-foreground text-xs">—</span>;
      }
      return (
        <span className="text-xs text-muted-foreground font-medium">
          {t("schoolAdmin")}
        </span>
      );
    },
    [t],
  );

  const filterGroups = React.useMemo<FilterGroup[]>(
    () => [
      {
        id: "role",
        label: t("role"),
        mode: "single",
        variant: "pills",
        options: ROLE_FILTERS.map((r) => ({
          value: r.value,
          label:
            r.value === "ALL"
              ? t("all")
              : r.value === "TEACHER"
                ? t("teacher")
                : r.value === "STUDENT"
                  ? t("student")
                  : r.value === "PARENT"
                    ? t("parent")
                    : t("admin"),
        })),
        value: roleFilter,
        onChange: (v) => setRoleFilter(v as any),
      },
    ],
    [roleFilter, setRoleFilter, t],
  );

  const renderTableHeaders = React.useCallback(
    (): DataDisplayTableHeader[] => [
      { key: "user", label: t("name") },
      { key: "role", label: t("role") },
      { key: "academic", label: t("academicInfo") },
      { key: "joined", label: t("joinedDate") },
      { key: "actions", label: t("actions"), className: "text-right" },
    ],
    [t],
  );

  const renderTableRow = React.useCallback(
    (item: MockMember) => [
      <td key="user" className="py-3 px-4 font-medium">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <UserRound className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs sm:text-sm text-foreground truncate">
              {item.name}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.email}</span>
            </p>
          </div>
        </div>
      </td>,
      <td key="role" className="py-3 px-4 whitespace-nowrap">
        <Badge variant="outline" className="capitalize text-xs font-semibold">
          {item.role.toLowerCase().replace("_", " ")}
        </Badge>
      </td>,
      <td key="academic" className="py-3 px-4 text-xs">
        {renderAcademicSummary(item)}
      </td>,
      <td
        key="joined"
        className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap"
      >
        {formatDate(item.createdAt)}
      </td>,
      <td key="actions" className="py-3 px-4 text-right whitespace-nowrap">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold gap-1 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
          onClick={() => handleSelectMember(item)}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("viewDetails")}</span>
        </Button>
      </td>,
    ],
    [formatDate, handleSelectMember, renderAcademicSummary, t],
  );

  const renderCard = React.useCallback(
    (item: MockMember) => (
      <Card
        key={item.id}
        className="border border-border/70 shadow-xs hover:border-primary/40 hover:shadow-md transition-all rounded-2xl cursor-pointer bg-card flex flex-col justify-between"
        onClick={() => handleSelectMember(item)}
      >
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <UserRound className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.email}</span>
                </p>
              </div>
            </div>
            <Badge variant="outline" className="capitalize shrink-0 text-[11px] font-semibold">
              {item.role.toLowerCase().replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs">
            {renderAcademicSummary(item)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
            <span>{formatDate(item.createdAt)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-semibold text-primary hover:text-primary gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMember(item);
              }}
            >
              <span>{t("viewDetails")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
    [formatDate, handleSelectMember, renderAcademicSummary, t],
  );

  const toolbarExtra = React.useMemo(() => {
    if (isDemoMode || schools.length <= 1) return undefined;
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline">
          {tCommon("info.chooseSchool")}:
        </span>
        <select
          className="h-9 px-3 rounded-xl border border-input bg-background text-xs font-semibold"
          value={selectedSchoolId}
          onChange={(e) => setSelectedSchoolId(e.target.value)}
        >
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    );
  }, [isDemoMode, schools, selectedSchoolId, setSelectedSchoolId, tCommon]);

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main DataDisplay Component */}
      <DataDisplay<MockMember>
        title={t("title")}
        description={t("subtitle")}
        searchPlaceholder={t("searchPlaceholder")}
        search={search}
        onSearchChange={setSearch}
        filterGroups={filterGroups}
        items={displayMembers}
        isDemoMode={isDemoMode}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        viewMode={viewMode}
        onViewToggle={setViewMode}
        renderCard={renderCard}
        renderTableHeaders={renderTableHeaders}
        renderTableRow={renderTableRow}
        isLoading={isLoading}
        showSearch
        showFilters
        showViewToggle
        showDemoBanner
        showPagination
        showPaginationSummary
        cardGridCols="2"
        getItemKey={(item) => item.id}
        toolbarExtra={toolbarExtra}
        headerAction={
          <Button
            variant="role"
            className="shadow-md"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t("addMember")}
          </Button>
        }
      />

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          isLoadingDetails={isLoadingDetails}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          isDemoMode={isDemoMode}
          usersList={usersList}
          memberUserId={memberUserId}
          onChangeMemberUserId={setMemberUserId}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMember}
        />
      )}
    </div>
  );
}
