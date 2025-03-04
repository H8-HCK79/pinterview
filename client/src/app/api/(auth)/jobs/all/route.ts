import JobModel from "@/db/models/jobs";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    if (status) {
      const filterJobs = await JobModel.filterByStatus(status);
      return Response.json({ filterJobs }, { status: 200 });
    }

    const jobs = await JobModel.fetchAll();
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