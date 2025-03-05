import { IJob, IJobResponseAI, IProject, JobInput } from "@/interfaces/IJob";
import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";
import { z } from "zod";
import TestModel from "./tests";

const jobSchema = z.object({
  company: z.string({ message: "Company name is required" }),
  position: z.string({ message: "Position of the job is required" }),
  rawDescription: z.string({ message: "Raw description is required" }),
});

export default class JobModel extends Mongoloquent {
  static collection = "jobs";

  static async fetchAll() {
    try {
      const jobs = await JobModel.get();

      return jobs;
    } catch (error) {
      throw error;
    }
  }

  static async fetchAllByUserId(userId: string) {
    try {
      const jobs = await JobModel.where("userId", new ObjectId(userId))
        .orderBy("createdAt", "desc")
        .get();

      return jobs;
    } catch (error) {
      throw error;
    }
  }

  static async tests() {
    return await JobModel.hasMany(TestModel, "jobId", "_id");
  }

  static async fetchById(jobId: string) {
    try {
      const job = await JobModel.with("tests").find(jobId);

      // your relationship data can accessed in the data property
      console.log(job.data);

      return job.data as IJob;
    } catch (error) {
      throw error;
    }
  }

  static async generate(payload: IJobResponseAI | string, userId: string) {
    try {
      if (typeof payload === "string") {
        throw new Error(payload);
      }

      const { company, position, description, skills, requirements, projects } =
        payload.job;
      const newJob = {
        userId: new ObjectId(userId),
        company,
        position,
        description,
        skills,
        requirements,
        status: "Ready to apply",
        readiness: 0,
        projects,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const response = await JobModel.insert(newJob);
      return response as IJob;
    } catch (error) {
      throw error;
    }
  }

  static async filterByStatus(status: string, userId: string) {
    try {
      const filterJob = await JobModel.where("status", status)
        .where("userId", new ObjectId(userId))
        .orderBy("createdAt", "desc")
        .get();
      //kalo pakai first baru data ny berupa objek
      return filterJob;
    } catch (error) {
      throw error;
    }
  }
  static async updateStatus(jobId: string, status: string) {
    try {
      const job = (await JobModel.where("_id", new ObjectId(jobId)).update({
        status,
      })) as IJob;
      return job;
    } catch (error) {
      throw error;
    }
  }

  static async updateProjects(jobId: string, projects: IProject[]) {
    try {
      const job = (await JobModel.where("_id", new ObjectId(jobId)).update({
        projects,
      })) as IJob;
      return job;
    } catch (error) {
      throw error;
    }
  }

  static async deleteJob(jobId: string) {
    try {
      await JobModel.where("_id", new ObjectId(jobId)).delete();

      return `Job has been deleted`;
    } catch (error) {
      throw error;
    }
  }
}
