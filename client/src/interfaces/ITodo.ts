import { ObjectId } from "mongodb";

export interface ITodo {
  _id: ObjectId;
  jobId: ObjectId;
  activity: string;
  notes: string;
  status: "Todo" | "In Progress" | "Done";
  createdAt: string;
  updatedAt: string;
}
