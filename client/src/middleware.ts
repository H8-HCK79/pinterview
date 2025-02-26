import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import { ObjectId } from "mongodb";
import { JOSEError } from "jose/errors";
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if(path === '/test') {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) 

    const cookieStore = await cookies()

    const access_token = cookieStore.get('token')?.value as string

    if(!access_token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const {payload} =await jose.jwtVerify<{_id:ObjectId,fullName:string}>(
      access_token,secret
    )
    try {
      const requestHeaders = new Headers(request.headers)
      
      requestHeaders.set("x-user-id", payload._id.toString());
      requestHeaders.set("x-user-fullName", payload.fullName);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      
      return response;
    } catch (err:unknown) {
      
      if (err instanceof JOSEError) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
      }
    }
    }

}
