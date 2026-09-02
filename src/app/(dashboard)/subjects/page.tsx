"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRoleThemeStore } from "@/stores/use-role-theme-store";
import { getMockSubjects } from "@/lib/mock-data";
import { subjectsApi, schoolsApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { Subject, School } from "@/types";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  BookmarkCheck,
  PlusCircle,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";

export default function SubjectsPage() {
  const { user, isDemoMode } = useAuthStore();
  const { activeRole } = useRoleThemeStore();
  const currentRole = user?.role || activeRole;

  // Real backend subjects state
  const [subjectsList, setSubjectsList] = React.useState<Subject[]>([]);
  const [schools, setSchools] = React.useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Modal / Form Dialog States
  const [showAddSubjectModal, setShowAddSubjectModal] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState("");
  const [newSubjectCode, setNewSubjectCode] = React.useState("");

  const [activeTopicSubjectId, setActiveTopicSubjectId] = React.useState<
    string | null
  >(null);
  const [newTopicName, setNewTopicName] = React.useState("");
  const [newTopicDesc, setNewTopicDesc] = React.useState("");

  const [activeSubTopicTopicId, setActiveSubTopicTopicId] = React.useState<
    string | null
  >(null);
  const [newSubTopicName, setNewSubTopicName] = React.useState("");
  const [newSubTopicDesc, setNewSubTopicDesc] = React.useState("");

  // Fetch schools for real users
  React.useEffect(() => {
    if (isDemoMode) return;
    schoolsApi
      .findAll()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setSchools(list);
        if (list.length > 0) setSelectedSchoolId(list[0].id);
      })
      .catch(() => {});
  }, [isDemoMode]);

  // Fetch subjects for selected school
  const loadSubjects = React.useCallback(async (schoolId: string) => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      const res = await subjectsApi.findSubjectsBySchool(schoolId);
      setSubjectsList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSubjectsList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isDemoMode && selectedSchoolId) {
      loadSubjects(selectedSchoolId);
    }
  }, [isDemoMode, selectedSchoolId, loadSubjects]);

  // Handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Subject created in demo mode");
        setShowAddSubjectModal(false);
        return;
      }
      if (!selectedSchoolId) {
        setFeedbackMsg("Please select a school first");
        return;
      }
      await subjectsApi.createSubject({
        schoolId: selectedSchoolId,
        name: newSubjectName,
        code: newSubjectCode,
      });
      setNewSubjectName("");
      setNewSubjectCode("");
      setShowAddSubjectModal(false);
      setFeedbackMsg("Subject created successfully!");
      loadSubjects(selectedSchoolId);
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to create subject"));
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopicSubjectId || !newTopicName.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Topic created in demo mode");
        setActiveTopicSubjectId(null);
        return;
      }
      await subjectsApi.createTopic({
        subjectId: activeTopicSubjectId,
        name: newTopicName,
        description: newTopicDesc,
      });
      setNewTopicName("");
      setNewTopicDesc("");
      setActiveTopicSubjectId(null);
      setFeedbackMsg("Topic added successfully!");
      if (selectedSchoolId) loadSubjects(selectedSchoolId);
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to add topic"));
    }
  };

  const handleCreateSubTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubTopicTopicId || !newSubTopicName.trim()) return;
    try {
      if (isDemoMode) {
        setFeedbackMsg("Sub-topic created in demo mode");
        setActiveSubTopicTopicId(null);
        return;
      }
      await subjectsApi.createSubTopic({
        topicId: activeSubTopicTopicId,
        name: newSubTopicName,
        description: newSubTopicDesc,
      });
      setNewSubTopicName("");
      setNewSubTopicDesc("");
      setActiveSubTopicTopicId(null);
      setFeedbackMsg("Sub-topic added successfully!");
      if (selectedSchoolId) loadSubjects(selectedSchoolId);
    } catch (error) {
      setFeedbackMsg(getErrorMessage(error, "Failed to add sub-topic"));
    }
  };

  // Mock data conversion for demo mode display
  const displaySubjects = isDemoMode ? getMockSubjects(currentRole) : [];

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Subjects & Topic Hierarchy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN"
              ? "Manage curriculum breakdown, add topics, and organize subtopics"
              : "Explore curriculum breakdown, topics, and subtopics"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isDemoMode && schools.length > 0 && (
            <select
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          {(currentRole === "TEACHER" || currentRole === "SCHOOL_ADMIN") && (
            <Button
              variant="role"
              className="shadow-md"
              onClick={() => setShowAddSubjectModal(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          )}
        </div>
      </div>

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

      {/* Demo Mode Mock Display */}
      {isDemoMode && (
        <div className="space-y-6">
          {displaySubjects.map((sub) => (
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
                      {sub.topics.length} Major Topics
                    </CardDescription>
                  </div>
                </div>

                {sub.canEdit && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Add Topic
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          <Layers className="w-4 h-4 text-primary" />
                          <span>{t.name}</span>
                        </div>
                        {sub.canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[11px]"
                          >
                            <PlusCircle className="w-3 h-3 mr-1" />
                            Sub-topic
                          </Button>
                        )}
                      </div>
                      <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                        {t.subTopics.map((st, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{st}</span>
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
      )}

      {/* Real Backend Data Display */}
      {!isDemoMode && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading curriculum subjects…</span>
            </div>
          ) : subjectsList.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground text-sm">
              No subjects registered for this school yet.
            </Card>
          ) : (
            <div className="space-y-6">
              {subjectsList.map((sub) => (
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

                    {(currentRole === "TEACHER" ||
                      currentRole === "SCHOOL_ADMIN") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setActiveTopicSubjectId(sub.id)}
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
                            {(currentRole === "TEACHER" ||
                              currentRole === "SCHOOL_ADMIN") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px]"
                                onClick={() => setActiveSubTopicTopicId(t.id)}
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
                              <div
                                key={st.id}
                                className="flex items-center gap-1.5"
                              >
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
          )}
        </>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Add New Subject</CardTitle>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Subject Name
                  </label>
                  <Input
                    placeholder="e.g. Mathematics"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Subject Code
                  </label>
                  <Input
                    placeholder="e.g. MATH-101"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Create Subject
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Topic Modal */}
      {activeTopicSubjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Add Topic</CardTitle>
              <button
                onClick={() => setActiveTopicSubjectId(null)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Topic Title
                  </label>
                  <Input
                    placeholder="e.g. Quadratic Equations"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Brief overview of topic"
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Save Topic
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Sub-Topic Modal */}
      {activeSubTopicTopicId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Add Sub-Topic</CardTitle>
              <button
                onClick={() => setActiveSubTopicTopicId(null)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubTopic} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Sub-Topic Title
                  </label>
                  <Input
                    placeholder="e.g. Factoring Quadratics"
                    value={newSubTopicName}
                    onChange={(e) => setNewSubTopicName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Sub-topic breakdown"
                    value={newSubTopicDesc}
                    onChange={(e) => setNewSubTopicDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="role" className="w-full">
                  Save Sub-Topic
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
