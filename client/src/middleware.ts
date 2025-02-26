import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if(path === '/test') {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) 

    const cookieStore = await cookies()

    const access_token = cookieStore.get('token')?.value as string

    if(!access_token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

  }

}
