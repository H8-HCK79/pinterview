import TransactionModel from "@/db/models/transaction";
import UserModel from "@/db/models/users";
import { IPackage } from "@/interfaces/ITransaction";
import { IUser } from "@/interfaces/IUser";
import { initiateMidtrans } from "@/services/midtrans/initiateMidtrans";
import { ObjectId } from "mongodb";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = req.headers.get("x-user-id") as string;

    const user: IUser = await UserModel.findById(userId);
    console.log(body, user);
    const response = await initiateMidtrans(body.package, user);

    if (!response) {
      throw response;
    }

    await TransactionModel.insert({
      orderId: response?.orderId,
      userId: new ObjectId(userId),
      amount: body.package.price,
      quota: body.package.quota,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json(
      {
        data: {
          token: response.token,
          redirectUrl: response.redirectUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
