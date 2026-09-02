"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useAssessmentStore } from "@/stores/use-assessment-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { assessmentsApi, submissionsApi } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/errors";
import { Assessment, QuestionOption, Submission } from "@/types";
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
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Award,
  BookOpen,
  Loader2,
} from "lucide-react";

export default function AssessmentPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string;
  const { selectedAnswers, setAnswer, clearAnswers } = useAssessmentStore();
  const { user, isDemoMode } = useAuthStore();

  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [submission, setSubmission] = React.useState<Submission | null>(null);

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes in seconds
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [calculatedScore, setCalculatedScore] = React.useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = React.useState(!isDemoMode && !!assessmentId);
  const [isSubmittingApi, setIsSubmittingApi] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const mockQuestions = [
    {
      id: "q1",
      question: "What is the solution to the equation 2x + 5 = 15?",
      points: 25,
      type: "MCQ" as const,
      options: [
        { id: "o1", text: "x = 5", isCorrect: true },
        { id: "o2", text: "x = 10", isCorrect: false },
        { id: "o3", text: "x = 3.5", isCorrect: false },
        { id: "o4", text: "x = 7.5", isCorrect: false },
      ],
    },
    {
      id: "q2",
      question: "If f(x) = 3x² - 2x + 1, calculate f(2).",
      points: 25,
      type: "MCQ" as const,
      options: [
        { id: "o1", text: "8", isCorrect: false },
        { id: "o2", text: "9", isCorrect: true },
        { id: "o3", text: "11", isCorrect: false },
        { id: "o4", text: "13", isCorrect: false },
      ],
    },
    {
      id: "q3",
      question: "The slope of a horizontal line is always zero.",
      points: 25,
      type: "TRUE_FALSE" as const,
      options: [
        { id: "o1", text: "True", isCorrect: true },
        { id: "o2", text: "False", isCorrect: false },
      ],
    },
    {
      id: "q4",
      question: "Which property states that a(b + c) = ab + ac?",
      points: 25,
      type: "MCQ" as const,
      options: [
        { id: "o1", text: "Associative Property", isCorrect: false },
        { id: "o2", text: "Distributive Property", isCorrect: true },
        { id: "o3", text: "Commutative Property", isCorrect: false },
        { id: "o4", text: "Identity Property", isCorrect: false },
      ],
    },
  ];

  // Fetch assessment & start submission for real users
  React.useEffect(() => {
    if (isDemoMode || !assessmentId) return;

    assessmentsApi
      .findOne(assessmentId)
      .then(async (res) => {
        const data = res.data;
        setAssessment(data);
        setErrorMsg(null);

        // Start submission attempt if student
        if (user?.role === "STUDENT") {
          try {
            const subRes = await submissionsApi.start({ assessmentId });
            setSubmission(subRes.data);
          } catch {
            // submission might already exist
          }
        }
      })
      .catch((error: unknown) => {
        setErrorMsg(
          getErrorMessage(error, "Failed to load assessment questions."),
        );
      })
      .finally(() => setIsLoading(false));
  }, [isDemoMode, assessmentId, user?.role]);

  // Questions source: backend assessment questions if available, else mock questions
  const questionsList =
    !isDemoMode && assessment?.questions && assessment.questions.length > 0
      ? assessment.questions
      : mockQuestions;

  // Timer Countdown Effect
  React.useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const currentQ = questionsList[currentIdx];
  const progressPercent =
    questionsList.length > 0
      ? ((currentIdx + 1) / questionsList.length) * 100
      : 0;

  const handleSelectOption = (questionId: string, answerText: string) => {
    if (isSubmitted) return;
    setAnswer(questionId, answerText);
  };

  const handleSubmitQuiz = async () => {
    if (isDemoMode || !submission?.id) {
      // Client side calculation for demo mode
      let earned = 0;
      let totalPossible = 0;

      mockQuestions.forEach((q) => {
        totalPossible += q.points;
        const selected = selectedAnswers[q.id];
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (
          selected &&
          (selected === correctOpt?.id || selected === correctOpt?.text)
        ) {
          earned += q.points;
        }
      });

      const scorePct = (earned / totalPossible) * 100;
      setCalculatedScore(scorePct);
      setIsSubmitted(true);
      return;
    }

    try {
      setIsSubmittingApi(true);
      setErrorMsg(null);

      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([qId, val]) => ({
          questionId: qId,
          answer: val,
        }),
      );

      const res = await submissionsApi.submit(submission.id, {
        answers: formattedAnswers,
      });

      const updatedSub = res.data;
      setSubmission(updatedSub);

      const numericScore =
        updatedSub?.score !== undefined && updatedSub?.score !== null
          ? Number(updatedSub.score)
          : 0;
      setCalculatedScore(numericScore);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to submit quiz attempt."));
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading assessment details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoModeBanner />}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quiz Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/assessments")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-sm text-amber-500">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Time Left: {timeFormatted}</span>
          </div>
          <Badge variant="role">
            Question {currentIdx + 1} of {questionsList.length}
          </Badge>
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      {/* Quiz Completion View */}
      {isSubmitted ? (
        <Card className="text-center py-10 px-6 space-y-4 border-emerald-500/30 bg-emerald-500/5">
          <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black">Assessment Complete! 🎉</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your answers have been processed by the backend auto-grading engine.
          </p>

          <div className="p-4 rounded-2xl bg-card border border-border inline-block min-w-50">
            <span className="text-xs uppercase font-semibold text-muted-foreground block">
              Final Score
            </span>
            <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {calculatedScore !== null
                ? `${calculatedScore.toFixed(1)}%`
                : "Graded"}
            </span>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                clearAnswers();
                setCurrentIdx(0);
              }}
            >
              Try Again
            </Button>
            <Button variant="role" onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
      ) : currentQ ? (
        /* Question Card */
        <Card className="border-border/60">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="uppercase tracking-wider">
                {assessment?.title || "Assessment Quiz"}
              </span>
              <Badge variant="outline">{currentQ.points || 1} Points</Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-3">
              {currentQ.type === "SHORT_ANSWER" ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block uppercase">
                    Your Written Response
                  </label>
                  <Input
                    placeholder="Type your answer here..."
                    value={selectedAnswers[currentQ.id] || ""}
                    onChange={(e) =>
                      handleSelectOption(currentQ.id, e.target.value)
                    }
                  />
                </div>
              ) : (
                currentQ.options?.map((opt: QuestionOption) => {
                  const optVal = opt.id || opt.text;
                  const isSelected = selectedAnswers[currentQ.id] === optVal;

                  return (
                    <button
                      key={opt.id || opt.text}
                      onClick={() => handleSelectOption(currentQ.id, optVal)}
                      className={`w-full p-4 rounded-xl border text-left font-medium text-sm transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-sm font-semibold"
                          : "border-border/80 bg-background/50 hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {currentIdx < questionsList.length - 1 ? (
                <Button
                  variant="role"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                >
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="role"
                  onClick={handleSubmitQuiz}
                  className="shadow-md"
                  isLoading={isSubmittingApi}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
