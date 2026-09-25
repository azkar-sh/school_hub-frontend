import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, UserPlus } from "lucide-react";
import { ParentRelationship, User } from "@/types";

interface LinkGuardianModalProps {
  parents: User[];
  students: User[];
  linkParentId: string;
  onChangeLinkParentId: (val: string) => void;
  linkStudentId: string;
  onChangeLinkStudentId: (val: string) => void;
  linkRelationship: ParentRelationship;
  onChangeLinkRelationship: (val: ParentRelationship) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function LinkGuardianModal({
  parents,
  students,
  linkParentId,
  onChangeLinkParentId,
  linkStudentId,
  onChangeLinkStudentId,
  linkRelationship,
  onChangeLinkRelationship,
  onSubmit,
  onClose,
  isSubmitting,
}: LinkGuardianModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Link Parent to Student
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Establish verified parental or guardian authority over a student ward.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block text-foreground">
              Select Parent / Guardian Account
            </label>
            <select
              value={linkParentId}
              onChange={(e) => onChangeLinkParentId(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">-- Choose Parent Account --</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block text-foreground">
              Select Student / Ward
            </label>
            <select
              value={linkStudentId}
              onChange={(e) => onChangeLinkStudentId(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">-- Choose Student Account --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block text-foreground">
              Parental Relationship
            </label>
            <select
              value={linkRelationship}
              onChange={(e) =>
                onChangeLinkRelationship(e.target.value as ParentRelationship)
              }
              required
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="FATHER">Ayah (Father)</option>
              <option value="MOTHER">Ibu (Mother)</option>
              <option value="GUARDIAN">Wali (Legal Guardian)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="role"
              disabled={isSubmitting}
              className="rounded-xl font-semibold text-xs gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Linking...</span>
                </>
              ) : (
                <span>Confirm Guardian Link</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
