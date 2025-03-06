import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function answerTestAI(
  formattedQuestions: {
    _id: string;
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
  You are an interviewee that is averagely good at answering IT concept questions.
  - For technical type question, you should write in code format, just the point, don't too much.

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
    max_tokens: 1000,
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
