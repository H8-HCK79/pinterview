import QuestionModel from "@/db/models/questions";
import TestModel from "@/db/models/tests";
import { ITest } from "@/interfaces/ITest";
import { generateQuestionsAI } from "@/services/openai/generateQuestionsAI";
import { NextRequest } from "next/server";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { testId } = await params;

    const questions = await QuestionModel.findAllByTestId(testId);

    console.log(questions)
    return Response.json({ data: questions }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { testId } = await params;
    // const { category, position } = await req.json();
    const test: ITest = await TestModel.findById(testId);

    if (test.isGenerated === true) {
      return Response.json(
        { error: "This test has already generated" },
        { status: 400 }
      );
    }

    const responseOpenAI = await generateQuestionsAI(test.category, test.position);

    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }
    if ("error" in responseOpenAI) {
      return Response.json(
        { error: responseOpenAI.error }, // ✅ Now safely access error
        { status: 400 }
      );
    }

    const questions = await QuestionModel.generateMany(responseOpenAI, testId);
    await TestModel.where("_id", testId).update({isGenerated: true})

    return Response.json({ response: questions }, { status: 201 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { testId } = await params
    const { answers } = await req.json();

    const question = await QuestionModel.findById(answers[0]._id);
    if (question.testId.toString() !== testId) {
      return Response.json({ error: "Invalid testId" }, { status: 400 });
    }

    for (let i = 0; i < answers.length; i++) {
      const {_id, answer} = answers[i];
      await QuestionModel.where("_id", _id).update({ answer });
    }

    return Response.json({ message: "Answers updated" }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}