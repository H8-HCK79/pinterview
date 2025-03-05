import JobModel from "@/db/models/jobs";
import { ZodError } from "zod";

export type Params = {
  params: Promise<{ jobId: string }>;
};
export async function PATCH(req: Request, { params }: Params) {
  try {
    console.log("HA")
    const { jobId } = await params;
    const body: { status: string } = await req.json();
    await JobModel.updateStatus(jobId, body.status);

    return Response.json({ message: "Status updated" }, { status: 200 });
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