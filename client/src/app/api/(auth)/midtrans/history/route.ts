import JobModel from "@/db/models/jobs";
import TransactionModel from "@/db/models/transaction";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") as string;

    console.log(userId, "<<< ok userId");

    const transactions = await TransactionModel.fetchAllByUserId(userId);
    return Response.json({ data: transactions }, { status: 200 });
  } catch (error: unknown) {
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}
