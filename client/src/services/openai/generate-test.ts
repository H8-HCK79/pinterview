import { IInterviewQuestion } from "@/interfaces/IQuestion";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTestAI(
  category: string, role: string
): Promise<IInterviewQuestion[] | null> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // Force OpenAI to return JSON
    messages: [
      {
        role: "system",
        content: `
  - Question topic must strictly about ${category}. No other topic
  - Question must be related and relevant to ${role} role
  - 5 concept questions and 5 technical questions

  You are an AI that only returns valid JSON data.
  Strictly format the output as a JSON array with the structure:

  questions: [
    {
      "type": "concept",
      "question": "Your concept question here",
      "expectedAnswer": "Key point 1, Key point 2"
    },
    ... (concept type until question number 5)
    {
      "type": "technical",
      "question": "Your technical question here",
      "expectedAnswer": "Your expected coding solution"
    },
    ... (technical type until question number 10)
  ]

  Return **only** the JSON array and nothing else. No explanations, no additional text.`,
      },
    ],
    temperature: 0.5,
    max_tokens: 1000, // Ensure enough tokens for a complete response
    top_p: 1,
  });

  // Extract response
  const responseText = completion.choices[0].message.content;

  if (!responseText) {
    console.error("AI response is null or undefined");
    return null;
  }

  console.dir(responseText, { depth: 10 });

  try {
    return JSON.parse(responseText); // Convert string to object
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return null;
  }
}
