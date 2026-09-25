import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Building2 } from "lucide-react";

interface CreateSchoolModalProps {
  schoolName: string;
  onChangeSchoolName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function CreateSchoolModal({
  schoolName,
  onChangeSchoolName,
  onSubmit,
  onClose,
  isSubmitting,
}: CreateSchoolModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Register Campus Branch
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add an institution profile to your multi-campus network.
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
              Campus Institution Name
            </label>
            <Input
              value={schoolName}
              onChange={(e) => onChangeSchoolName(e.target.value)}
              placeholder="e.g. SMA Cendekia Bangsa - Kampus 2"
              required
              className="h-11 rounded-xl"
            />
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
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Campus</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
