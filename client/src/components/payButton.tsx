"use client";

import React from "react";

// Declare type for window.snap locally
interface SnapWindow extends Window {
  snap?: {
    pay: (
      token: string,
      options: {
        onSuccess: (result: unknown) => void;
      }
    ) => void;
  };
}

export default function PayButton() {
  const handleOnPay = async () => {
    try {
      const snapWindow = window as SnapWindow;

      const data: any = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/midtrans/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": `application/json`,
          },
          body: JSON.stringify({
            amount: 25000,
          }),
        }
      );

      // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
      if (snapWindow.snap) {
        snapWindow.snap.pay(data.transactionToken, {
          onSuccess: async function (result) {
            /* You may add your own implementation here */
            alert("payment success!");
            console.log(result);

            await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/users/quota`,
              {
                method: "POST",
              }
            );
          },
        });
      } else {
        alert("Snap script not loaded yet. Please try again.");
      }
    } catch (err) {
      console.log(err, "<<< err handleOnPay");
    }
  };

  return (
    <button id="pay-button" className="btn btn-primary" onClick={handleOnPay}>
      Pay!
    </button>
  );
}
