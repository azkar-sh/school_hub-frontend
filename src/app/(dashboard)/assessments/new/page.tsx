'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { assessmentSchema } from '@/lib/schemas';
import { useAssessmentStore } from '@/stores/use-assessment-store';
import { apiClient } from '@/lib/api-client';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, ArrowLeft, Save, HelpCircle } from 'lucide-react';

export default function NewAssessmentPage() {
  const router = useRouter();
  const { draft, updateDraft, addQuestionToDraft, removeQuestionFromDraft, resetDraft } = useAssessmentStore();
  const [activeStep, setActiveStep] = React.useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Question Creator State
  const [qText, setQText] = React.useState('');
  const [qType, setQType] = React.useState<'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER'>('MCQ');
  const [qPoints, setQPoints] = React.useState(10);
  const [options, setOptions] = React.useState([
    { text: 'Option A', isCorrect: true },
    { text: 'Option B', isCorrect: false },
    { text: 'Option C', isCorrect: false },
    { text: 'Option D', isCorrect: false },
  ]);

  const methods = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      title: draft.title || '',
      description: draft.description || '',
      type: draft.type || 'QUIZ',
      dueAt: draft.dueAt || '',
    },
  });

  const handleStep1Submit = (data: any) => {
    updateDraft(data);
    setActiveStep(2);
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    addQuestionToDraft({
      question: qText,
      type: qType,
      points: Number(qPoints) || 10,
      options: qType === 'MCQ' ? options : qType === 'TRUE_FALSE' ? [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ] : [],
    });

    setQText('');
    setOptions([
      { text: 'Option A', isCorrect: true },
      { text: 'Option B', isCorrect: false },
      { text: 'Option C', isCorrect: false },
      { text: 'Option D', isCorrect: false },
    ]);
  };

  const handleFinalPublish = async () => {
    try {
      setIsSubmitting(true);
      // Attempt backend API call
      await apiClient.post('/assessments', {
        title: draft.title,
        description: draft.description,
        type: draft.type,
        dueAt: draft.dueAt || undefined,
        questions: draft.questions,
      }).catch(() => {
        // Fallback for demo mode if backend server is offline
      });

      resetDraft();
      router.push('/assessments');
    } catch {
      router.push('/assessments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Create Assessment</h1>
            <p className="text-xs text-muted-foreground">Step {activeStep} of 2: {activeStep === 1 ? 'General Details' : 'Question Bank'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={activeStep === 1 ? 'role' : 'outline'}>1. Details</Badge>
          <Badge variant={activeStep === 2 ? 'role' : 'outline'}>2. Questions ({draft.questions.length})</Badge>
        </div>
      </div>

      {/* Step 1: General Details Form */}
      {activeStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>Enter title, assessment type, description and due date</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleStep1Submit)} className="space-y-5">
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
                      { label: 'Quiz (Short Practice Test)', value: 'QUIZ' },
                      { label: 'Exam (Formal Assessment)', value: 'EXAM' },
                      { label: 'Assignment (Homework)', value: 'ASSIGNMENT' },
                    ]}
                  />

                  <FormInput
                    name="dueAt"
                    label="Due Date (Optional)"
                    type="date"
                  />
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
      )}

      {/* Step 2: Question Bank Builder */}
      {activeStep === 2 && (
        <div className="space-y-6">
          {/* Question Creator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <span>Add Question to Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Question Prompt
                </label>
                <Input
                  placeholder="e.g. What is the solution to 2x + 5 = 15?"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Question Type
                  </label>
                  <select
                    value={qType}
                    onChange={(e: any) => setQType(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Points Weight
                  </label>
                  <Input
                    type="number"
                    value={qPoints}
                    onChange={(e) => setQPoints(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* MCQ Options Config */}
              {qType === 'MCQ' && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Multiple Choice Options (Select Correct Answer)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={opt.isCorrect}
                          onChange={() =>
                            setOptions(
                              options.map((o, i) => ({ ...o, isCorrect: i === idx }))
                            )
                          }
                          className="h-4 w-4 text-primary"
                        />
                        <Input
                          value={opt.text}
                          onChange={(e) =>
                            setOptions(
                              options.map((o, i) => (i === idx ? { ...o, text: e.target.value } : o))
                            )
                          }
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button type="button" onClick={handleAddQuestion} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>

          {/* List of Added Questions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Question List ({draft.questions.length})</CardTitle>
                <CardDescription>Review questions added to this assessment</CardDescription>
              </div>
              <Button
                variant="role"
                onClick={handleFinalPublish}
                disabled={draft.questions.length === 0 || isSubmitting}
                isLoading={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Publish Assessment
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {draft.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No questions added yet. Use the form above to add your first question.
                </div>
              ) : (
                draft.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-primary">Q{idx + 1}.</span>
                        <Badge variant="outline" className="text-[10px]">
                          {q.type} ({q.points} pts)
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm">{q.question}</p>
                      {q.type === 'MCQ' && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                          {q.options.map((o, i) => (
                            <span key={i} className={o.isCorrect ? 'text-emerald-500 font-bold' : ''}>
                              {o.isCorrect ? '✓ ' : ''}{o.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestionFromDraft(idx)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
