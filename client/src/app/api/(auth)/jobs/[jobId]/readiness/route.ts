import JobModel from "@/db/models/jobs";
import TestModel from "@/db/models/tests";

export type Params = {
  params: Promise<{ jobId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;

    const tests = await TestModel.findAllByJobId(jobId);

    const scores = tests.map((test) => test.score);
    console.log(scores);
    const readiness = Math.round(
      (scores.reduce((total, num) => total + num) / scores.length) * 10
    );

    await JobModel.where("_id", jobId).update({ readiness: Number(readiness) });

    console.log(readiness);
    return Response.json(
      { message: "Job readiness has been updated", data: readiness },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { jobId } = await params;

    const tests = await TestModel.findAllByJobId(jobId);

    const newScores = tests.map((test) => ({
      _id: test._id,
      score: Math.round(Math.random() * 7) + 3,
      summary: `${`description_${test.category}_${test.position}_${test.score}_${test.jobId}_${test.createdAt}`.toLowerCase()}`,
      isGenerated: true,
      isReviewed: true,
    }));

    for (let i = 0; i < newScores.length; i++) {
      const { _id, score, summary, isGenerated, isReviewed } = newScores[i];

      await TestModel.where("_id", _id).update({
        score,
        summary,
        isGenerated,
        isReviewed,
      });
    }

    console.log(newScores);
    return Response.json(
      { message: "Job readiness has been generated", data: newScores },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
