import QuestionModel from "@/db/models/questions";
import TestModel from "@/db/models/tests";
import { IQuestion } from "@/interfaces/IQuestion";
import { answerTestAI } from "@/services/openai/answerTestAI";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    const questions: IQuestion[] = await QuestionModel.findAllByTestId(testId);
    const formattedQuestions = questions.map((questionParent) => {
      const { _id, type, question } = questionParent;
      return {
        _id,
        type,
        question,
      };
    });

    const responseOpenAI = await answerTestAI(formattedQuestions);
    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }
    const { answers } = responseOpenAI;

    for (let i = 0; i < answers.length; i++) {
      const { _id, answer } = answers[i];

      await QuestionModel.where("_id", _id).update({
        answer,
      });
    }

    return Response.json({ response: responseOpenAI }, { status: 201 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
