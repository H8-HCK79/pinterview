import QuestionModel from "@/db/models/questions";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    const conceptQuestions = await QuestionModel.findConceptsByTestId(testId);

    console.log(conceptQuestions, "<<< ok conceptQuestions");
    return Response.json({ data: conceptQuestions.data }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
