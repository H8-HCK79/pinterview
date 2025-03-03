import { ObjectId } from "mongodb";

export interface IQuestion {
  _id: ObjectId;
  testId: ObjectId;
  type: string;
  question: string;
  expectedAnswer: string;
  answer: string;
  correctness: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInterviewQuestion {
  type: "concept" | "technical";
  question: string;
  expectedAnswer: string;
}
