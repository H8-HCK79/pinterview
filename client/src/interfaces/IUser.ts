
import { ObjectId } from "mongodb";


export interface IUser {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
  quota: number;
  createdAt: string;
  updatedAt: string;
}
export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
};



export interface LoginInput  {
  email: string;
  password: string;
};


