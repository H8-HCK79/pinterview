import UserModel from "@/db/models/users";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await UserModel.Register(body);

    return Response.json({ user }, { status: 201 });
  } catch (error: unknown) {
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
