import midtransClient from "midtrans-client";
import { nanoid } from "nanoid";

export async function initiateMidtransTrx(payload) {
  try {
    /*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
npm install --save midtrans-client*/

    //SAMPLE REQUEST START HERE

    //orderId
    const { fullName, email, amount } = payload
    const orderId = nanoid();

    // Create Snap API instance
    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: fullName,
        email: email,
        phone: "08111222333",
      },
    };

    // 2. Create Transaction to midtrans
    const transaction = await snap.createTransaction(parameter);
    // transaction token
    console.log(transaction, "<<< transaction");
    let transactionToken = transaction.token;
    console.log("transactionToken:", transactionToken);

    // 3. Create order in database
    // create(orderId, amount, userId, transactionToken)

    console.log("<<< ok initiateMIdtransTrx");
    return { transactionToken, orderId }
  } catch (err) {
    console.log(err, "<<< err initiateMIdtransTrx");
  }
}