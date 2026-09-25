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
  GraduationCap,
  UserCircle,
} from "lucide-react";
import { Subject, TeachingAssignment } from "@/types";
import { useTranslations } from "next-intl";

interface SubjectsListProps {
  isLoading: boolean;
  subjects: Subject[];
  canEditCurriculum: boolean;
  onAddTopic: (subjectId: string) => void;
  onAddSubTopic: (topicId: string) => void;
  isTeacher?: boolean;
  assignedSubjects?: Subject[];
  otherSubjects?: Subject[];
  subjectClassesMap?: Record<string, TeachingAssignment[]>;
  subjectTeachersMap?: Record<string, string[]>;
}

function SubjectCard({
  sub,
  canEdit,
  onAddTopic,
  onAddSubTopic,
  classAssignments,
  teacherNames,
}: {
  sub: Subject;
  canEdit: boolean;
  onAddTopic: (subjectId: string) => void;
  onAddSubTopic: (topicId: string) => void;
  classAssignments?: TeachingAssignment[];
  teacherNames?: string[];
}) {
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  return (
    <Card className="border-border/60">
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
              {t("majorTopicsCount", { count: sub.topics?.length ?? 0 })}
            </CardDescription>
            {teacherNames && teacherNames.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {teacherNames.join(", ")}
                </span>
              </div>
            )}
            {classAssignments && classAssignments.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                {classAssignments.map((ta) => (
                  <Badge
                    key={ta.id}
                    variant="secondary"
                    className="text-[10px] gap-1"
                  >
                    {ta.class?.name}
                    {ta.academicYear && (
                      <span className="text-muted-foreground">
                        ({ta.academicYear.name})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onAddTopic(sub.id)}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            {t("addTopic")}
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {sub.topics && sub.topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sub.topics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>{topic.name}</span>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() => onAddSubTopic(topic.id)}
                    >
                      <PlusCircle className="w-3 h-3 mr-1" />
                      {t("subTopicShort")}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{topic.description}</p>

                <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                  {topic.subTopics?.map((st) => (
                    <div key={st.id} className="flex items-center gap-1.5">
                      <BookmarkCheck className="w-3.5 h-3.5 text-success" />
                      <span className="font-medium text-foreground">
                        {st.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border/60 text-center text-xs text-muted-foreground">
            {canEdit
              ? "No syllabus topics added yet. Click '+ Add Topic' to create curriculum units."
              : "No syllabus topics added yet. Topics and subtopics are authored by assigned subject teachers."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SubjectsList({
  isLoading,
  subjects,
  canEditCurriculum,
  onAddTopic,
  onAddSubTopic,
  isTeacher = false,
  assignedSubjects = [],
  otherSubjects = [],
  subjectClassesMap = {},
  subjectTeachersMap = {},
}: SubjectsListProps) {
  const t = useTranslations("Subjects");
  const tCommon = useTranslations("Common.info");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{tCommon("loadingSubjects")}</span>
      </div>
    );
  }

  if (isTeacher) {
    return (
      <div className="space-y-8">
        {/* Section 1: Assigned subjects */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{tCommon("mySubjects")}</h2>
            <Badge variant="default" className="text-[11px]">
              {assignedSubjects.length}
            </Badge>
          </div>
          {assignedSubjects.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground text-sm">
              {t("noAssignedSubjects")}
            </Card>
          ) : (
            <div className="space-y-6">
              {assignedSubjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  sub={sub}
                  canEdit={true}
                  onAddTopic={onAddTopic}
                  onAddSubTopic={onAddSubTopic}
                  classAssignments={subjectClassesMap[sub.id]}
                  teacherNames={subjectTeachersMap[sub.id]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Other subjects */}
        {otherSubjects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-muted-foreground">
                {t("otherSubjects")}
              </h2>
              <Badge variant="outline" className="text-[11px]">
                {otherSubjects.length}
              </Badge>
            </div>
            <div className="space-y-6">
              {otherSubjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  sub={sub}
                  canEdit={false}
                  onAddTopic={onAddTopic}
                  onAddSubTopic={onAddSubTopic}
                  teacherNames={subjectTeachersMap[sub.id]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <Card className="py-12 text-center text-muted-foreground text-sm">
        {t("noSubjectsForSchool")}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {subjects.map((sub) => (
        <SubjectCard
          key={sub.id}
          sub={sub}
          canEdit={canEditCurriculum}
          onAddTopic={onAddTopic}
          onAddSubTopic={onAddSubTopic}
          teacherNames={subjectTeachersMap[sub.id]}
        />
      ))}
    </div>
  );
}
