import TransactionModel from "@/db/models/transaction";
import UserModel from "@/db/models/users";
import { IUser } from "@/interfaces/IUser";
import { initiateMidtrans } from "@/services/midtrans/initiateMidtrans";
import { ObjectId } from "mongodb";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // const userId = req.headers.get("x-user-id") as string;

    // console.log(userId, "<<< userId Initiate");
    // const user: IUser = await UserModel.findById(userId);

    // const { fullName, email } = user;
    // const { amount } = body;

    const response = await initiateMidtrans();
    // {
    //     "token": "60c7b2e1-a994-4333-b0ab-d3b3dafae17b",
    //     "redirect_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/60c7b2e1-a994-4333-b0ab-d3b3dafae17b"
    // }
    // simpan transaction di database
    // await TransactionModel.insert({
    //   orderId: orderId,
    //   userId: new ObjectId(userId),
    //   amount: amount,
    //   status: "Pending",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });
    // console.log("<<< ok TransactionModel");

    return Response.json(
      {
        data: response,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
