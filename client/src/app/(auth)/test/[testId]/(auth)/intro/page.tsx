"use client";

import { useSecondsContext } from "@/context/SecondsContext";
import { redirect, useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function IntroPage() {
  const { testId } = useParams<{ testId: string }>();
  console.log(testId, "ID");
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const { setSeconds, setIsPlaying } = useSecondsContext();

  const savedPlaying = localStorage.getItem("is_playing");
  if (savedPlaying === "true") {
    localStorage.setItem("is_playing", "true");
    redirect(`/test/${testId}/concept`);
  }

  const handleGenerateQuestions = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/questions`,
        {
          method: "POST",
        }
      );
      if (!res.ok) {
        throw res;
      }
      console.log(res, "<<< ok handleGenerateQuestions");

      // put the context here and start the timer
      setSeconds(1800); // Reset the timer
      setIsPlaying(true); // Start the timer

      router.push(`/test/${testId}/concept`);
    } catch (err: unknown) {
      console.log(err, "<<< err handleGenerateQuestions");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#0077b6] to-[#023e8a]">
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full"></div>

      <div className="max-w-2xl w-full bg-white shadow-lg p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Welcome to the Test
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Please read the instructions carefully before proceeding.
        </p>

        <div className="mt-4 space-y-3 text-gray-700">
          {[
            "Ensure a stable internet connection.",
            "No switching tabs during the test.",
            "Or else you will be punished from the test.",
            "Answer honestly without external help.",
            "Time is limited, manage it wisely.",
          ].map((rule, index) => (
            <div key={index} className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586l-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {rule}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="agree"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            onChange={() => setAgreed(!agreed)}
          />
          <label htmlFor="agree" className="ml-2 text-gray-700">
            I have read and agree to the instructions.
          </label>
        </div>

        <button
          className={`w-full mt-4 py-2 px-4 rounded-lg text-white ${
            agreed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!agreed}
          onClick={handleGenerateQuestions}
        >
          Continue to Test
        </button>
      </div>
    </div>
  );
}
