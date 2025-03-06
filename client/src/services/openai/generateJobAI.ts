import { IJobResponseAI } from "@/interfaces/IJob";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateJobAI(
  company: string,
  position: string,
  rawDescription: string
): Promise<IJobResponseAI | { error: string }> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // Force OpenAI to return JSON
    messages: [
      {
        role: "system",
        content: `
  Follow the algorithm:
    1. Identify whether the job is related to **IT (Information Technology)**.
    2. If the job is NOT related to IT, return the following JSON:
    { "error": "Job is not related to IT" }
    3. If the job is IT-related. Filter job description, and categorize them based on description, skills, and requirements.
      You are an AI that only returns valid JSON data.
      Strictly format the output as a JSON array with the structure:

      {
        job: {
          "position": "${position}", //input by user
          "company": "${company}", //input by user
          "description": "Short summary of the job", //summerize by you
          "skills": ["skil 1", "skill 2"] // filter by you like Javascript, PostgreSQL, React, etc that will be tested by concept and technical/coding
          "requirements": ["requirement 1", "requirement 2"] // filter by you like Bachelor's Degree in Computer Science, 1+ years experience, etc
          "projects": [
            {
              "name": "project name", // your generate must be specific theme and relevant based on job desc and user position (for the scope of the project)
              "isCompleted": false
            }
            ... //total 3 generated projects
          ] 
        },
      }

      Return **only** the JSON array and nothing else. No explanations, no additional text.`,
      },
      {
        role: "user",
        content: JSON.stringify(rawDescription),
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
    return {error: "AI response is null or undefined"};
  }

  console.dir(responseText, { depth: 10 });

  try {
    const parsedResponse = JSON.parse(responseText);

    // Check if AI returned an error
    if (parsedResponse.error) {
      return { error: parsedResponse.error };
    }

    return parsedResponse; // Return job details
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {error: "Failed to parse AI response:"};
  }
}
