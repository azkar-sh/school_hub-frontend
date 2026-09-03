import { FormProvider, UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TeachingAssignment } from "@/types";
import { AssessmentFormData } from "../hooks";

interface AssessmentDetailsStepProps {
  methods: UseFormReturn<AssessmentFormData>;
  isDemoMode: boolean;
  assignments: TeachingAssignment[];
  selectedAssignmentId: string;
  onSelectAssignment: (id: string) => void;
  onSubmit: (data: AssessmentFormData) => void;
}

export function AssessmentDetailsStep({
  methods,
  isDemoMode,
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
  onSubmit,
}: AssessmentDetailsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Details</CardTitle>
        <CardDescription>
          Select target teaching assignment class, title, assessment type,
          description and due date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            {!isDemoMode && assignments.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Teaching Assignment / Class Section
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => onSelectAssignment(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium"
                  required
                >
                  <option value="">
                    -- Select Class & Subject Assignment --
                  </option>
                  {assignments.map((ta) => (
                    <option key={ta.id} value={ta.id}>
                      {ta.subject?.name || "Subject"} -{" "}
                      {ta.class?.name || "Class"} ({ta.academicYear?.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <FormInput
              name="title"
              label="Assessment Title"
              placeholder="e.g. Mathematics Midterm Algebra Quiz"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                name="type"
                label="Assessment Type"
                options={[
                  { label: "Quiz (Short Practice Test)", value: "QUIZ" },
                  { label: "Exam (Formal Assessment)", value: "EXAM" },
                  { label: "Assignment (Homework)", value: "ASSIGNMENT" },
                ]}
              />

              <FormInput name="dueAt" label="Due Date (Optional)" type="date" />
            </div>

            <FormTextarea
              name="description"
              label="Description & Instructions"
              placeholder="Instructions for students regarding time limits, topics covered..."
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="role">
                Next: Add Questions
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
