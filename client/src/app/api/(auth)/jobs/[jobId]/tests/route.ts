import { generateTestAI } from "@/services/openai/generate-test";

export async function POST(req: Request) {
  try {
    const { category, role } = await req.json();
    const responseOpenAI = await generateTestAI(category, role);

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
