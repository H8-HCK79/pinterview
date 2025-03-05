"use client";

import Link from "next/link";
import { useState } from "react";

export default function PurchasePage() {
  const [isOrdered, setIsOrdered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [redirectUrl, setRedirectUrl] = useState<string>(
    "https://cdn.prod.website-files.com/625350933660db97afa01913/649d3deb57c468e5321bcd67_payment-processing-infographic.png"
  );

  const quotaOptions = [
    {
      id: 1,
      quota: 10,
      price: 30000,
      description: "Basic package for starters",
    },
    {
      id: 2,
      quota: 25,
      price: 50000,
      description: "Standard package for job hunter",
    },
    {
      id: 3,
      quota: 100,
      price: 100000,
      description: "Intensive package for full-time job hunter",
    },
  ];

  const handleOnPay = async () => {
    try {
      console.log(quotaOptions[selectedOption - 1]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/midtrans/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ package: quotaOptions[selectedOption - 1] }),
        }
      );

      if (!res.ok) {
        return "error";
      }

      interface IInitiateResponse {
        data: {
          token: string;
          redirectUrl: string;
        };
      }
      const data: IInitiateResponse = await res.json();
      console.log(data, "CALLBACK");

      setRedirectUrl(data.data.redirectUrl);
      setIsOrdered(true);
    } catch (err) {
      console.log(err, "<<< err handleOnPay");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
      <div className="absolute -top-10 right-40 w-40 h-40 rounded-full bg-blue-200 opacity-20 blur-lg"></div>
      <div className="absolute -bottom-10 left-40 w-56 h-56 rounded-full bg-blue-600 opacity-20 blur-xl"></div>

      <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex w-full max-w-6xl relative z-10">
        {/* Left side - Quota options (75% width) */}
        <div className="w-3/4 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Purchase Quota
            </h1>
            <p className="text-gray-600 mb-8">
              Select a package that fits your needs
            </p>

            <div className="grid gap-6">
              {quotaOptions.map((option) => (
                <div
                  key={option.id}
                  className={`bg-white border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedOption === option.id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-300 hover:border-blue-400"
                  } hover:shadow-md`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedOption === option.id
                            ? "border-blue-500 bg-white"
                            : "border-gray-300 bg-white"
                        } flex items-center justify-center mr-4`}
                      >
                        {selectedOption === option.id && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {option.quota} Quota
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(option.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleOnPay}
                disabled={!selectedOption}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all shadow-md ${
                  selectedOption
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedOption ? "Proceed to Payment" : "Select a Package"}
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Payment iframe (25% width) */}
        <div className="w-2/5 bg-gray-50">
          <div className="h-full flex flex-col">
            <div className="flex justify-between p-4 bg-white border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Payment</h2>
              <Link href="/purchase/history" className="text-lg font-semibold text-blue-600 hover:underline">History</Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              {!isOrdered ? (
                <div className="text-center text-gray-500 p-6 w-full">
                  {selectedOption ? (
                    <div>
                      <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-700">
                          Selected Package:
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {
                            quotaOptions.find(
                              (opt) => opt.id === selectedOption
                            )?.quota
                          }{" "}
                          Quota
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          {formatPrice(
                            quotaOptions.find(
                              (opt) => opt.id === selectedOption
                            )?.price || 0
                          )}
                        </p>
                      </div>
                      <p className="mt-4">
                        Click "Proceed to Payment" to continue
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4">Select a package to continue</p>
                  )}
                </div>
              ) : (
                <iframe
                  id="payment"
                  src={redirectUrl}
                  title="Payment Gateway"
                  className="h-full w-full"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
