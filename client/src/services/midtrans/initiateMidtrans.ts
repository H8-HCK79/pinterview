import { IPackage } from "@/interfaces/ITransaction";
import { IUser } from "@/interfaces/IUser";
import axios from "axios";
import { nanoid } from "nanoid";

export async function initiateMidtrans(payload: IPackage, user: IUser) {
  try {
    const { price } = payload;
    const { fullName, email } = user;
    const orderId = nanoid();

    console.log(price, fullName, email);

    // Send a POST request
    const { data } = await axios({
      method: "POST",
      url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic U0ItTWlkLXNlcnZlci1GelkxU29FcDh6MWNybGlJRzVvWEJLSXk6",
      },
      data: {
        transaction_details: {
          order_id: orderId,
          gross_amount: price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: fullName,
          email: email,
          phone: "08111222333",
        },
      },
    });

    const { token, redirect_url }: { token: string; redirect_url: string } = data;

    console.log(token, redirect_url, orderId, "<<< initMid")
    return { token, redirectUrl: redirect_url, orderId };
  } catch (err) {
    console.log(err, "<<< err initiateMIdtrans");
  }
}

// initiateMidtrans()
