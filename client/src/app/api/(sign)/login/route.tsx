import UserModel from "@/interfaces/IUser";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const access_token = await UserModel.Login(body);

    const cookieStore = await cookies();
    cookieStore.set("token", access_token);

    return Response.json({ access_token }, { status: 200 });
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
