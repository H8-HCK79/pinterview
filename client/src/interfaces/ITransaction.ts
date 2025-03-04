import { ObjectId } from "mongodb";

export interface ITransaction {
  _id: ObjectId;
  userId: ObjectId;
  orderId: string;
  amount: number;
  quota: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPackage {
  id: number;
  quota: number;
  price: number;
  description: string;
}