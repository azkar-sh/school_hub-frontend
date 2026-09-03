export interface PlayerQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface PlayerQuestion {
  id: string;
  question: string;
  points: number;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  options: PlayerQuestionOption[];
}

// Fallback question bank used when running in demo mode / no backend questions exist.
export const mockQuestions: PlayerQuestion[] = [
  {
    id: "q1",
    question: "What is the solution to the equation 2x + 5 = 15?",
    points: 25,
    type: "MCQ",
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
    type: "MCQ",
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
    type: "TRUE_FALSE",
    options: [
      { id: "o1", text: "True", isCorrect: true },
      { id: "o2", text: "False", isCorrect: false },
    ],
  },
  {
    id: "q4",
    question: "Which property states that a(b + c) = ab + ac?",
    points: 25,
    type: "MCQ",
    options: [
      { id: "o1", text: "Associative Property", isCorrect: false },
      { id: "o2", text: "Distributive Property", isCorrect: true },
      { id: "o3", text: "Commutative Property", isCorrect: false },
      { id: "o4", text: "Identity Property", isCorrect: false },
    ],
  },
];
