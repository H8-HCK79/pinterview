import TransactionModel from "@/db/models/transaction";
import UserModel from "@/db/models/users";
import { ITransaction } from "@/interfaces/ITransaction";
import { IUser } from "@/interfaces/IUser";
import { sha512 } from "sha512-crypt-ts";
import { createHash } from "node:crypto";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status_code, order_id, gross_amount, signature_key } = body;

    const { data: order } = (await TransactionModel.where(
      "orderId",
      order_id
    ).first()) as { data: ITransaction };
    if (!order) {
      return Response.json({ error: "Not Found" }, { status: 404 });
    }
    if (order.status === "Paid") {
      return Response.json({ error: "Order has been paid" }, { status: 400 });
    }

    // SHA512(order_id + status_code + gross_amount + ServerKey);

    const key = createHash("sha512")
      .update(
        order.orderId +
          status_code +
          `${order.amount}.00` +
          process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    // console.log(
    //   order.orderId,
    //   status_code,
    //   order.amount,
    //   process.env.MIDTRANS_SERVER_KEY
    // );

    console.log(key, "KEY");
    console.log(signature_key, "SIGNATUREKEY");

    if (key !== signature_key) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await TransactionModel.where("orderId", order_id).update({
      status: "Paid",
    });

    const user: IUser = await UserModel.findById(order.userId.toString());
    await UserModel.where("_id", order.userId).update({
      quota: user.quota + order.quota,
    });

    return Response.json(
      { message: "Transaction Successful" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
