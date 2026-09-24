import { UserRole } from "@/types";

export interface SubmissionRow {
  id: string;
  studentName: string;
  assessmentTitle: string;
  subject: string;
  score: number | null;
  submittedAt: string;
  status: "SUBMITTED" | "GRADED";
}

export function getMockSubmissions(role: UserRole): SubmissionRow[] {
  if (role === "TEACHER") {
    // Teachers see all students' submissions
    return [
      {
        id: "sub-1",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 100,
        submittedAt: "2026-08-25 14:30",
        status: "GRADED",
      },
      {
        id: "sub-2",
        studentName: "Siti Rahma",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 85,
        submittedAt: "2026-08-25 13:15",
        status: "GRADED",
      },
      {
        id: "sub-3",
        studentName: "Dewi Lestari",
        assessmentTitle: "Science Quiz 1 - 8A",
        subject: "Science",
        score: 92,
        submittedAt: "2026-08-24 16:45",
        status: "GRADED",
      },
      {
        id: "sub-4",
        studentName: "Andi Wijaya",
        assessmentTitle: "Science Homework 1 - 8A",
        subject: "Science",
        score: null,
        submittedAt: "2026-08-25 11:20",
        status: "SUBMITTED",
      },
      {
        id: "sub-5",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8B",
        subject: "Mathematics",
        score: 75,
        submittedAt: "2026-08-23 09:00",
        status: "GRADED",
      },
    ];
  }

  if (role === "STUDENT") {
    // Students see only their own submission history
    return [
      {
        id: "sub-1",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8A",
        subject: "Mathematics",
        score: 100,
        submittedAt: "2026-08-25 14:30",
        status: "GRADED",
      },
      {
        id: "sub-4",
        studentName: "Budi Santoso",
        assessmentTitle: "Science Homework 1 - 8A",
        subject: "Science",
        score: null,
        submittedAt: "2026-08-25 11:20",
        status: "SUBMITTED",
      },
      {
        id: "sub-5",
        studentName: "Budi Santoso",
        assessmentTitle: "Mathematics Quiz 1 - 8B",
        subject: "Mathematics",
        score: 75,
        submittedAt: "2026-08-23 09:00",
        status: "GRADED",
      },
    ];
  }

  // PARENT — child's submissions
  return [
    {
      id: "sub-1",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Mathematics Quiz 1 - 8A",
      subject: "Mathematics",
      score: 100,
      submittedAt: "2026-08-25 14:30",
      status: "GRADED",
    },
    {
      id: "sub-4",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Science Homework 1 - 8A",
      subject: "Science",
      score: null,
      submittedAt: "2026-08-25 11:20",
      status: "SUBMITTED",
    },
    {
      id: "sub-5",
      studentName: "Budi Santoso (your child)",
      assessmentTitle: "Mathematics Quiz 1 - 8B",
      subject: "Mathematics",
      score: 75,
      submittedAt: "2026-08-23 09:00",
      status: "GRADED",
    },
  ];
}

import { Submission } from "@/types";

export function getMockSubmissionDetail(id: string): Submission | null {
  const details: Record<string, Submission> = ({
    "sub-1": {
      id: "sub-1",
      assessmentId: "asm-1",
      studentId: "stu-1",
      startedAt: "2026-08-25T14:00:00Z",
      submittedAt: "2026-08-25T14:30:00Z",
      status: "GRADED",
      score: 100,
      scorePercentage: 100,
      student: {
        id: "stu-1",
        name: "Budi Santoso",
        email: "student1.garuda@learnhub.com",
        role: "STUDENT",
      },
      assessment: {
        id: "asm-1",
        title: "Mathematics Quiz 1 - 8A",
        type: "QUIZ",
        schoolId: "school-1",
        teachingAssignmentId: "ta-1",
        teachingAssignment: {
          id: "ta-1",
          subject: { id: "sub-math", name: "Mathematics", code: "MATH" },
          class: { id: "cls-8a", name: "Class 8A", grade: 8 },
        },
      },
      answers: [
        {
          id: "ans-1-1",
          submissionId: "sub-1",
          questionId: "q1",
          answer: "x = 5",
          pointsEarned: 25,
          question: {
            id: "q1",
            question: "What is the solution to the equation 2x + 5 = 15?",
            type: "MCQ",
            points: 25,
            options: [
              { id: "o1", text: "x = 5", isCorrect: true },
              { id: "o2", text: "x = 10", isCorrect: false },
              { id: "o3", text: "x = 3.5", isCorrect: false },
              { id: "o4", text: "x = 7.5", isCorrect: false },
            ],
          },
        },
        {
          id: "ans-1-2",
          submissionId: "sub-1",
          questionId: "q2",
          answer: "True",
          pointsEarned: 25,
          question: {
            id: "q2",
            question: "The slope of a horizontal line is always zero.",
            type: "TRUE_FALSE",
            points: 25,
            options: [
              { id: "o1", text: "True", isCorrect: true },
              { id: "o2", text: "False", isCorrect: false },
            ],
          },
        },
        {
          id: "ans-1-3",
          submissionId: "sub-1",
          questionId: "q3",
          answer: "Linear equations have degree 1 and form straight lines, while quadratic equations have degree 2 and form parabolas.",
          pointsEarned: 50,
          question: {
            id: "q3",
            question: "Explain the difference between linear and quadratic equations in your own words.",
            type: "SHORT_ANSWER",
            points: 50,
          },
        },
      ],
    },
    "sub-2": {
      id: "sub-2",
      assessmentId: "asm-1",
      studentId: "stu-2",
      startedAt: "2026-08-25T13:00:00Z",
      submittedAt: "2026-08-25T13:15:00Z",
      status: "GRADED",
      score: 85,
      scorePercentage: 85,
      student: {
        id: "stu-2",
        name: "Siti Rahma",
        email: "siti.rahma@learnhub.com",
        role: "STUDENT",
      },
      assessment: {
        id: "asm-1",
        title: "Mathematics Quiz 1 - 8A",
        type: "QUIZ",
        schoolId: "school-1",
        teachingAssignmentId: "ta-1",
        teachingAssignment: {
          id: "ta-1",
          subject: { id: "sub-math", name: "Mathematics", code: "MATH" },
          class: { id: "cls-8a", name: "Class 8A", grade: 8 },
        },
      },
      answers: [
        {
          id: "ans-2-1",
          submissionId: "sub-2",
          questionId: "q1",
          answer: "x = 5",
          pointsEarned: 25,
          question: {
            id: "q1",
            question: "What is the solution to the equation 2x + 5 = 15?",
            type: "MCQ",
            points: 25,
            options: [
              { id: "o1", text: "x = 5", isCorrect: true },
              { id: "o2", text: "x = 10", isCorrect: false },
            ],
          },
        },
        {
          id: "ans-2-2",
          submissionId: "sub-2",
          questionId: "q3",
          answer: "Linear equations only have x. Quadratic equations have x squared which creates a curved line or parabola.",
          pointsEarned: 40,
          question: {
            id: "q3",
            question: "Explain the difference between linear and quadratic equations in your own words.",
            type: "SHORT_ANSWER",
            points: 50,
          },
        },
      ],
    },
    "sub-4": {
      id: "sub-4",
      assessmentId: "asm-2",
      studentId: "stu-4",
      startedAt: "2026-08-25T11:00:00Z",
      submittedAt: "2026-08-25T11:20:00Z",
      status: "SUBMITTED",
      score: undefined,
      scorePercentage: null,
      student: {
        id: "stu-4",
        name: "Andi Wijaya",
        email: "andi.wijaya@learnhub.com",
        role: "STUDENT",
      },
      assessment: {
        id: "asm-2",
        title: "Science Homework 1 - 8A",
        type: "ASSIGNMENT",
        schoolId: "school-1",
        teachingAssignmentId: "ta-2",
        teachingAssignment: {
          id: "ta-2",
          subject: { id: "sub-sci", name: "Science", code: "SCI" },
          class: { id: "cls-8a", name: "Class 8A", grade: 8 },
        },
      },
      answers: [
        {
          id: "ans-4-1",
          submissionId: "sub-4",
          questionId: "q4-1",
          answer: "Photosynthesis",
          pointsEarned: 25,
          question: {
            id: "q4-1",
            question: "Which process do plants use to convert sunlight into energy?",
            type: "MCQ",
            points: 25,
            options: [
              { id: "o1", text: "Photosynthesis", isCorrect: true },
              { id: "o2", text: "Respiration", isCorrect: false },
              { id: "o3", text: "Transpiration", isCorrect: false },
            ],
          },
        },
        {
          id: "ans-4-2",
          submissionId: "sub-4",
          questionId: "q4-2",
          answer: "The cell membrane acts as a selective barrier that controls what enters and exits the cell, protecting its internal organelles.",
          pointsEarned: null, // Pending manual grading!
          question: {
            id: "q4-2",
            question: "Describe the primary function of the cell membrane in eukaryotic cells.",
            type: "SHORT_ANSWER",
            points: 50,
          },
        },
        {
          id: "ans-4-3",
          submissionId: "sub-4",
          questionId: "q4-3",
          answer: "Mitochondria produce ATP through cellular respiration which gives power to the cell.",
          pointsEarned: null, // Also pending manual grading!
          question: {
            id: "q4-3",
            question: "Why is mitochondria referred to as the powerhouse of the cell?",
            type: "SHORT_ANSWER",
            points: 25,
          },
        },
      ],
    },
  } as unknown as Record<string, Submission>);

  return details[id] || details["sub-4"];
}

