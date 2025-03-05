import { type NextRequest } from "next/server";
import JobModel from "@/db/models/jobs";
import { ZodError } from "zod";
import { IJob, IJobResponseAI } from "@/interfaces/IJob";

import { generateJobAI } from "@/services/openai/generateJobAI";
import TestModel from "@/db/models/tests";
import UserModel from "@/db/models/users";
import { IUser } from "@/interfaces/IUser";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const userId = request.headers.get("x-user-id") as string;

    console.log(userId, "<<< ok userId");

    if (status) {
      const filterJobs = await JobModel.filterByStatus(status, userId);
      return Response.json({ data: filterJobs }, { status: 200 });
    }

    const jobs = await JobModel.fetchAllByUserId(userId);
    return Response.json({ data: jobs }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const issues = error.issues;
      const issue = issues[0];

      return Response.json({ message: issue.message }, { status: 404 });
    } else {
      return Response.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") as string;
    const { company, position, rawDescription } = await req.json();
    const responseOpenAI: IJobResponseAI | { error: string } =
      await generateJobAI(company, position, rawDescription);

    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }

    if ("error" in responseOpenAI) {
      return Response.json(
        { error: responseOpenAI.error }, // ✅ Now safely access error
        { status: 400 }
      );
    }

    const job: IJob = await JobModel.generate(responseOpenAI, userId);

    job.skills.forEach(async (skill) => {
      await TestModel.generate({ category: skill, position }, job._id);
    });

    const user: IUser = await UserModel.findById(userId.toString());
    await UserModel.where("_id", userId).update({
      quota: user.quota - 1,
    });

    return Response.json({ response: job }, { status: 201 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
