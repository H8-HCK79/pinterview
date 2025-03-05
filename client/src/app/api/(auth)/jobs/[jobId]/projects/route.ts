import JobModel from "@/db/models/jobs";
import { IProject } from "@/interfaces/IJob";
import { ZodError } from "zod";

export type Params = {
  params: Promise<{ jobId: string }>;
};
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;
    const body: { projects: IProject[] } = await req.json();
    await JobModel.updateProjects(jobId, body.projects);
    console.log(body.projects);

    return Response.json({ message: "Projects updated" }, { status: 200 });
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