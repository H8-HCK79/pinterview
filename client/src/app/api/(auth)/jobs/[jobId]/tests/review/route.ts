import { reviewTestAI } from "@/services/openai/review-test";

export async function POST(req: Request) {
  try {
    const { userResponses } = await req.json();
    const responseOpenAI = await reviewTestAI(userResponses);

    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }

    return Response.json({ response: responseOpenAI }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
