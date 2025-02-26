
import UserModel from "@/db/models/users";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") as string;

    const result = await UserModel.GoogleLogin(token);

    return Response.json({ result }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues;
      const issue = issues[0];
      return Response.json({ message: issue.message }, { status: 400 });
    } else {
      return Response.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }
}
