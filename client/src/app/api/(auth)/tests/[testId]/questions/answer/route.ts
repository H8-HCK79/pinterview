import QuestionModel from "@/db/models/questions";
import { IFormattedQuestion } from "@/interfaces/IQuestion";
import { answerTestAI } from "@/services/openai/answerTestAI";

export type Params = {
  params: Promise<{ testId: string }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    // 1️⃣ Fetch all questions at once
    const formattedQuestions: IFormattedQuestion[] =
      await QuestionModel.findFormattedByTestId(testId);

      console.log(formattedQuestions)

    // 2️⃣ Call OpenAI (Streaming would be ideal, but Mongoloquent does not support async updates)
    const responseOpenAI = await answerTestAI(formattedQuestions);
    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test answers" },
        { status: 500 }
      );
    }

    // 3️⃣ Prepare batch updates for Mongoloquent
    const updatePromises = responseOpenAI.answers.map(({ _id, answer }) =>
      QuestionModel.where("_id", _id).update({ answer })
    );

    // 4️⃣ Execute updates in parallel (better performance)
    await Promise.all(updatePromises);

    return Response.json({ response: responseOpenAI }, { status: 201 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
