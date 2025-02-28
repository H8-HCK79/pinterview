import { ObjectId } from "mongodb";

export interface IQuestion {
  _id: ObjectId;
  testId: ObjectId;
  type:string;
  question: string;
  answer: string;
  expectedAnswer: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInterviewQuestion {
  type: "concept" | "technical";
  question: string;
  expectedAnswer: string;
}