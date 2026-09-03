import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SubTopic } from "@/types";
import { NewQuestionOption } from "../hooks";

interface QuestionCreatorCardProps {
  isDemoMode: boolean;
  subTopics: SubTopic[];
  selectedSubTopicId: string;
  onSelectSubTopic: (id: string) => void;
  qText: string;
  onChangeQText: (value: string) => void;
  qType: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  onChangeQType: (value: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER") => void;
  qPoints: number;
  onChangeQPoints: (value: number) => void;
  options: NewQuestionOption[];
  onChangeOptions: (options: NewQuestionOption[]) => void;
  onAddQuestion: () => void;
}

export function QuestionCreatorCard({
  isDemoMode,
  subTopics,
  selectedSubTopicId,
  onSelectSubTopic,
  qText,
  onChangeQText,
  qType,
  onChangeQType,
  qPoints,
  onChangeQPoints,
  options,
  onChangeOptions,
  onAddQuestion,
}: QuestionCreatorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <span>Add Question to Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isDemoMode && subTopics.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Curriculum Sub-Topic Target
            </label>
            <select
              value={selectedSubTopicId}
              onChange={(e) => onSelectSubTopic(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
            >
              {subTopics.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Question Prompt
          </label>
          <Input
            placeholder="e.g. What is the solution to 2x + 5 = 15?"
            value={qText}
            onChange={(e) => onChangeQText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Question Type
            </label>
            <select
              value={qType}
              onChange={(event) => {
                const value = event.target.value;
                if (
                  value === "MCQ" ||
                  value === "TRUE_FALSE" ||
                  value === "SHORT_ANSWER"
                ) {
                  onChangeQType(value);
                }
              }}
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
              onChange={(e) => onChangeQPoints(Number(e.target.value))}
            />
          </div>
        </div>

        {/* MCQ Options Config */}
        {qType === "MCQ" && (
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
                      onChangeOptions(
                        options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx,
                        })),
                      )
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      onChangeOptions(
                        options.map((o, i) =>
                          i === idx ? { ...o, text: e.target.value } : o,
                        ),
                      )
                    }
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={onAddQuestion}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </CardContent>
    </Card>
  );
}
