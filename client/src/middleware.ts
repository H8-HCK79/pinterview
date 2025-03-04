import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { ObjectId } from "mongodb";
import { JOSEError } from "jose/errors";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    if (path.includes("api/profile") || path.includes("/api/jobs")) {
      console.log("========== MIDDLEWARE ==========");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      // === UNCOMMENT NANTI ===
      const cookieStore = await cookies();
      const access_token = cookieStore.get("access_token")?.value as string;
      console.log(access_token, "<<< ok access_token");

      // const access_token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2M1MWE4ZWRiYjFiYjY3OTEwMGQ2NDkiLCJpYXQiOjE3NDEwMjcyOTF9.t18DlRj3dRPVNpkPrNa3Cqaw3kRlzRmfNLpHQBEuA4A";

      if (!access_token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      }
      const { payload } = await jose.jwtVerify<{
        _id: ObjectId;
      }>(access_token, secret);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload._id.toString());
      // requestHeaders.set("x-user-fullName", payload.fullName);

      console.log(requestHeaders.get("x-user-id"), "<<< ok requestHeaders");

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      return response;
    }
  } catch (err: unknown) {
    if (err instanceof JOSEError) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
