import { type NextRequest } from "next/server";
import JobModel from "@/db/models/jobs";
import { ZodError } from "zod";
import { IJobResponseAI } from "@/interfaces/IJob";

import { generateJobAI } from "@/services/openai/generate-job";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    if (status) {
      const filterJobs = await JobModel.filterByStatus(status);
      return Response.json({ filterJobs }, { status: 200 });
    }

    const jobs = await JobModel.getAllJob();
    return Response.json({ jobs }, { status: 200 });
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
    const responseOpenAI: IJobResponseAI | string = await generateJobAI(
      company,
      position,
      rawDescription
    );

    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }
    const job = await JobModel.generateJob(responseOpenAI, userId);

    return Response.json({ data: job }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
