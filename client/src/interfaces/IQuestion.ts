export interface IQuestion {
  _id: string;
  testId: string;
  question: string;
  answer: string;
  solution: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInterviewQuestion {
  type: "concept" | "technical";
  question: string;
  expectedAnswer: string;
}