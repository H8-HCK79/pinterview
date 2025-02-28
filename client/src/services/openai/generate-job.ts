import { IJobResponseAI } from "@/interfaces/IJob";
import { IInterviewQuestion } from "@/interfaces/IQuestion"
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateJobAI(
  company: string,
  position: string,
  rawDescription: string
): Promise<IJobResponseAI | string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // Force OpenAI to return JSON
    messages: [
      {
        role: "system",
        content: `
  - 
  ${rawDescription}.
  Filter job description above, and categorize them based on description, skills, and requirements.

  You are an AI that only returns valid JSON data.
  Strictly format the output as a JSON array with the structure:

  job: {
      "company": ${company},
      "position": ${position},
      "description": "Short description about the company and position",
      "skills": ["skil 1", "skill 2"] // filter like Javascript, PostgreSQL, React, etc
      "requirements": ["requirement 1", "requirement 2"] // filter like Bachelor's Degree in Computer Science, 1+ years experience, etc
    },

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
    return "AI response is null or undefined";
  }

  console.dir(responseText, { depth: 10 });

  try {
    return JSON.parse(responseText); // Convert string to object
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return "Failed to parse AI response:";
  }
}
