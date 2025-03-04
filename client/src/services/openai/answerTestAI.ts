import { ObjectId } from "mongodb";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function answerTestAI(
  formattedQuestions: {
    _id: ObjectId;
    type: string;
    question: string;
  }[]
): Promise<{
  answers: { _id: string; answer: number }[];
}> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
  You are an interviewee that is bad at answering all the technical questions.

  Return only JSON with the following format:
  {
    "answers": [
      {
        "_id": "_id"
        "answer": "Your answer",
      }
    ],
  }
        `,
      },
      {
        role: "user",
        content: JSON.stringify(formattedQuestions),
      },
    ],
    temperature: 0.5,
    max_tokens: 600,
    top_p: 1,
  });

  const responseText = completion.choices[0].message.content;

  if (!responseText) {
    console.error("AI response is null or undefined");
    return { answers: [] };
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return { answers: [] };
  }
}
