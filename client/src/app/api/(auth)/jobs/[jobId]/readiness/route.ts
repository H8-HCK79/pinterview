import JobModel from "@/db/models/jobs";
import QuestionModel from "@/db/models/questions";
import TestModel from "@/db/models/tests";

export type Params = {
  params: Promise<{ jobId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;

    const questions = await TestModel.findAllByJobId(jobId);

    const scores = questions.map(question => question.score)
    console.log(scores)
    const readiness = Math.round((scores.reduce((total, num) => total + num) / scores.length) * 10)

    await JobModel.where("_id", jobId).update({ readiness: Number(readiness) });

    console.log(readiness);
    return Response.json({ message: "Job readiness has been updated", data: readiness }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
