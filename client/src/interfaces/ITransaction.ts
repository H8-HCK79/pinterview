import { ObjectId } from "mongodb";

export interface ITransaction {
  _id: ObjectId;
  userId: ObjectId;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
