import { ObjectId } from "mongodb";

export interface ITest {
  _id: ObjectId;
  jobId: ObjectId;
  category: string;
  position: string;
  summary: string;
  score: number;
  isGenerated: boolean;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface ITestInput {
  category: string;
  position:string
}