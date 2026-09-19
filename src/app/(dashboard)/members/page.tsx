"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useMembersPage } from "./hooks";
import { MembersHeader } from "./_components/MembersHeader";
import { MembersFilterBar } from "./_components/MembersFilterBar";
import { MembersListCard } from "./_components/MembersListCard";
import { MemberDetailModal } from "./_components/MemberDetailModal";
import { AddMemberModal } from "./_components/AddMemberModal";
import { useTranslations } from "next-intl";

export default function MembersPage() {
  const t = useTranslations("Common");
  const {
    isDemoMode,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    selectedMember,
    setSelectedMember,
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
    filteredMembers,
  } = useMembersPage();

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      <MembersHeader
        isDemoMode={isDemoMode}
        schools={schools}
        selectedSchoolId={selectedSchoolId}
        onSelectSchool={setSelectedSchoolId}
        onAddMember={() => setShowAddModal(true)}
      />

      {/* Feedback */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <MembersFilterBar
        search={search}
        onChangeSearch={setSearch}
        roleFilter={roleFilter}
        onChangeRoleFilter={setRoleFilter}
      />

      {/* Loading state */}
      {!isDemoMode && isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("loadingMembers")}</span>
        </div>
      )}

      {/* Member List */}
      {(!isLoading || isDemoMode) && (
        <MembersListCard
          members={filteredMembers}
          onSelectMember={setSelectedMember}
        />
      )}

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

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
