import UserModel from "@/db/models/users";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const access_token = await UserModel.Login(body);

    const cookieStore = await cookies();
    cookieStore.set("token", access_token);

    return Response.json({ access_token }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const issues = err.issues;
      const issue = issues[0];
      return Response.json({ message: issue.message }, { status: 400 });
    } else if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 401 });
    } else {
      return Response.json(
        { message: `Internal server error` },
        { status: 500 }
      );
    }
  }
}
