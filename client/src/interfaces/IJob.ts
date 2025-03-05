import { ObjectId } from "mongodb";
import { ITest } from "./ITest";

export interface IJob {
  _id: ObjectId;
  userId: ObjectId;
  company: string;
  position: string;
  description: string;
  skills: string[];
  requirements: string[];
  status:
    | "Ready to apply"
    | "Applied"
    | "Pending"
    | "Interview"
    | "Accepted"
    | "Ghosted"
    | "Rejected";
  readiness: number;
  createdAt: string;
  updatedAt: string;
}

export interface IJobClient {
  _id: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  skills: string[];
  requirements: string[];
  status:
    | "Ready to apply"
    | "Applied"
    | "Pending"
    | "Interview"
    | "Accepted"
    | "Ghosted"
    | "Rejected";
  readiness: number;
  projects: {
    name: string;
    isCompleted: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IAggregatedJob {
  _id: ObjectId;
  userId: ObjectId;
  company: string;
  position: string;
  description: string;
  skills: string[];
  requirements: string[];
  status:
    | "Ready to apply"
    | "Applied"
    | "Pending"
    | "Interview"
    | "Accepted"
    | "Ghosted"
    | "Rejected";
  readiness: number;
  tests: ITest[];
  projects: {
    name: string;
    isCompleted: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface JobInput {
  company: string;
  position: string;
  rawDescription: string;
}

export interface IJobResponseAI {
  job: {
    company: string;
    position: string;
    description: string;
    skills: string[];
    requirements: string[];
    projects: {
      name: string;
      isCompleted: string;
    }[];
  };
}
