"use client";

import React, { useState } from "react";

export default function PayButton() {
  const [isOrdered, setIsOrdered] = useState(false);

  const redirectUrl =
    "https://app.sandbox.midtrans.com/snap/v4/redirection/6d1e4907-2690-4900-b4af-bbb8cfc667b4";

  const handleOnPay = async () => {
    try {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_BASE_URL}/midtrans/initiate`,
      //   {
      //     method: "POST",
      //   }
      // );

      // if (!res.ok) {
      //   return "error";
      // }
      // const data = await res.json();

      setIsOrdered(true)
    } catch (err) {
      console.log(err, "<<< err handleOnPay");
    }
  };

  return (
    <div>
      <button id="pay-button" className="btn btn-primary" onClick={handleOnPay}>
        Pay!
      </button>
      <iframe
        id="payment"
        src={isOrdered ? redirectUrl : undefined}
        title="description"
        className={`h-[40rem] w-[20rem] ${isOrdered ? "" : "hidden"}`}
      ></iframe>
    </div>
  );
}
