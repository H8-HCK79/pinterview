import QuestionModel from "@/db/models/questions";
import TestModel from "@/db/models/tests";
import { IQuestion } from "@/interfaces/IQuestion";
import { ITest } from "@/interfaces/ITest";
import { reviewTestAI } from "@/services/openai/reviewTestAI";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    const test: ITest = await TestModel.findById(testId);

    if (test.isReviewed === true) {
      return Response.json(
        { error: "This test has already reviewed" },
        { status: 400 }
      );
    }

    const questions: IQuestion[] = await QuestionModel.findAllByTestId(testId);
    const userResponses = questions.map((questionParent) => {
      const { _id, type, question, answer, expectedAnswer } = questionParent;
      return {
        _id,
        type,
        question,
        answer,
        expectedAnswer,
      };
    });

    const responseOpenAI = await reviewTestAI(userResponses);
    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }
    const { reviews, score, summary } = responseOpenAI;

    for (let i = 0; i < reviews.length; i++) {
      const { _id, correctness, feedback } = reviews[i];

      await QuestionModel.where("_id", _id).update({
        correctness,
        feedback,
      });
    }

    await TestModel.where("_id", testId).update({ score, summary });

    return Response.json({ response: responseOpenAI }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
