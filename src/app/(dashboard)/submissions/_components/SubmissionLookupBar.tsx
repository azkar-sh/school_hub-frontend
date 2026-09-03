import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SubmissionLookupBarProps {
  searchSubId: string;
  onChangeSearchSubId: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SubmissionLookupBar({
  searchSubId,
  onChangeSearchSubId,
  onSubmit,
  isLoading,
}: SubmissionLookupBarProps) {
  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          placeholder="Enter Submission UUID to inspect details & grade..."
          value={searchSubId}
          onChange={(e) => onChangeSearchSubId(e.target.value)}
          className="flex-1 text-xs"
        />
        <Button type="submit" variant="role" size="sm" isLoading={isLoading}>
          Fetch Submission
        </Button>
      </form>
    </Card>
  );
}
