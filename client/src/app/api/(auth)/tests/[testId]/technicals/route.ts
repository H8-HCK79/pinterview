import QuestionModel from "@/db/models/questions";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    const technicalQuestions = await QuestionModel.findTechnicalsByTestId(
      testId
    );

    console.log(technicalQuestions, "<<< ok technicalQuestions");
    return Response.json({ data: technicalQuestions.data }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
