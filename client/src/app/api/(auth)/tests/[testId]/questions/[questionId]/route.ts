import QuestionModel from "@/db/models/questions";
import TestModel from "@/db/models/tests";
import { IQuestion } from "@/interfaces/IQuestion";
import { ITest } from "@/interfaces/ITest";
import { generateQuestionsAI } from "@/services/openai/generateQuestionsAI";
import { NextRequest } from "next/server";

export type Params = {
  params: Promise<{ testId: string, questionId: string }>;
};
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { testId, questionId } = await params
    const { answer } = await req.json();

    const question = await QuestionModel.findById(questionId)
    if (question.testId.toString() !== testId) {
      return Response.json({ error: "Invalid testId" }, { status: 400 });
    }
    const response = await QuestionModel.where("_id", questionId).update({answer});

    return Response.json({ data: response }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
