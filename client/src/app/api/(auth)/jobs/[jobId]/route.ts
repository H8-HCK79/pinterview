import JobModel from "@/db/models/jobs";
import { ZodError } from "zod";

export type Params = {
  params: Promise<{ jobId: string; status?: string ,testId:string}>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;
    const job = await JobModel.fetchById(jobId);
    

    return Response.json({ data: job }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      const issues = err.issues;
      const issue = issues[0];

      return Response.json({ message: issue.message }, { status: 401 });
    } else if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 404 });
    } else {
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;
    if (!jobId) throw new Error("Job is not found");

    const job = await JobModel.fetchById(jobId);
    if (
      job.status !== "Accepted" &&
      job.status !== "Ghosted" &&
      job.status !== "Rejected"
    ) {
      return Response.json({ error: "Ready to apply/Pending/Applied/Interview status can't be deleted" }, { status: 400 });
    }
      const message = await JobModel.deleteJob(jobId);

    return Response.json({ message }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      const issues = err.issues;
      const issue = issues[0];

      return Response.json({ message: issue.message }, { status: 401 });
    } else if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 404 });
    } else {
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
