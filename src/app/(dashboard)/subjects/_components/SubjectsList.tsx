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
  Loader2,
  BookOpen,
  Layers,
  BookmarkCheck,
  PlusCircle,
} from "lucide-react";
import { Subject } from "@/types";

interface SubjectsListProps {
  isLoading: boolean;
  subjects: Subject[];
  canEditCurriculum: boolean;
  onAddTopic: (subjectId: string) => void;
  onAddSubTopic: (topicId: string) => void;
}

export function SubjectsList({
  isLoading,
  subjects,
  canEditCurriculum,
  onAddTopic,
  onAddSubTopic,
}: SubjectsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading curriculum subjects…</span>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <Card className="py-12 text-center text-muted-foreground text-sm">
        No subjects registered for this school yet.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {subjects.map((sub) => (
        <Card key={sub.id} className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">{sub.name}</CardTitle>
                  <Badge variant="outline">{sub.code}</Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  {sub.topics?.length ?? 0} Major Topics
                </CardDescription>
              </div>
            </div>

            {canEditCurriculum && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onAddTopic(sub.id)}
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Add Topic
              </Button>
            )}
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sub.topics?.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{t.name}</span>
                    </div>
                    {canEditCurriculum && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => onAddSubTopic(t.id)}
                      >
                        <PlusCircle className="w-3 h-3 mr-1" />
                        Sub-topic
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.description}
                  </p>

                  <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                    {t.subTopics?.map((st) => (
                      <div key={st.id} className="flex items-center gap-1.5">
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-medium text-foreground">
                          {st.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
