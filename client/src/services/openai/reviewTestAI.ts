import { ObjectId } from "mongodb";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function reviewTestAI(
  userResponses: {
    _id: ObjectId;
    type: string;
    question: string;
    expectedAnswer: string;
  }[]
): Promise<{
  reviews: { _id: string; correctness: number; feedback: string }[];
  score: number;
  summary: string;
}> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
  You are a strict interviewer reviewing test answers.
  For each question, assess if the provided answer fully matches the expected answer.
  If it's a concept question, determine if it fully or partially fits the key points in expectedAnswer.
  If it's a technical question, evaluate the correctness of the code.

  Return only JSON with the following format:
  {
    "reviews": [
      {
        "_id": "_id"
        "correctness": "number, 1 to 10",
        "feedback": "your feedback"
      }
    ],
    "score": "score average based on correctness",
    "summary": "summary based on overall feedbacks"
  }
        `,
      },
      {
        role: "user",
        content: JSON.stringify(userResponses),
      },
    ],
    temperature: 0.5,
    max_tokens: 1000,
    top_p: 1,
  });

  const responseText = completion.choices[0].message.content;

  if (!responseText) {
    console.error("AI response is null or undefined");
    return { reviews: [], score: 0, summary: "" };
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return { reviews: [], score: 0, summary: "" };
  }
}
