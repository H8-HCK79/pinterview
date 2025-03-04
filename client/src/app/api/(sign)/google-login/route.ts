import UserModel from "@/db/models/users";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const access_token = await UserModel.GoogleLogin(body.token);
    console.log(access_token,"AAAAAAA");
    
    const cookieStore = await cookies();
    cookieStore.set("access_token", access_token.accessToken);
    return Response.json({ access_token }, { status: 200 });
  } catch (error) {
    console.log(error, "SSSS");

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
