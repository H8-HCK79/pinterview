import { ObjectId } from "mongodb";

export interface IJob {
  _id: ObjectId,
userId: ObjectId,
company: string 
position: string
description: string
skills: string[]
requirements: string[]
status:'Ready to apply' | 'Applied' | 'Pending' | 'Interview' | 'Accepted' | 'Ghosted' | 'Rejected'
readiness: number 
createdAt: string,
updatedAt: string,
}



export interface JobInput {
  company: string;
  position: string;
  rawDescription: string;
}

export interface IJobResponseAI {
  response: {
      job: {
          company: string;
          position: string;
          description: string;
          skills: string[];
          requirements: string[];
      };
  };
}