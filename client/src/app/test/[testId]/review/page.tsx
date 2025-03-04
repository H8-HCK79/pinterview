"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface IReviewItem {
  _id: string;
  question: string;
  answer: string;
  expectedAnswer: string;
  correctness: number;
  feedback: string;
}

export default function ReviewPage() {
  const params = useParams();
  const testId = params?.testId;
  const router = useRouter();

  const [reviewData, setReviewData] = useState<IReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewData = async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/questions`
      );
      if (!res.ok) throw new Error("Failed to fetch review data.");
      const data = await res.json();
      setReviewData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!testId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/review`,
        { method: "POST" }
      );
      if (!res.ok) {
        throw res;
      }

      fetchReviewData(); // Refresh review data reactively
    } catch (err) {
      console.log(err);
      setError("Failed to submit review request.");
    }
  };

  useEffect(() => {
    if (testId) {
      fetchReviewData();
    }
  }, [testId]); //Fixed useEffect dependency

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        <p className="text-center text-xl font-medium text-white z-10">
          Loading review data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        <p className="text-center text-xl font-medium text-white bg-red-500/80 px-6 py-3 rounded-lg shadow-lg z-10">
          Error: {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col items-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
      <div className="absolute -top-10 right-40 w-40 h-40 rounded-full bg-blue-200 opacity-20 blur-lg"></div>
      <div className="absolute -bottom-10 left-40 w-56 h-56 rounded-full bg-blue-600 opacity-20 blur-xl"></div>

      {/* Content */}
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Review Page
        </h1>

        <button
          onClick={handleSubmitReview}
          className="mb-8 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold shadow-lg mx-auto block"
        >
          Submit Review
        </button>

        <div className="w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl">
          {reviewData.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-lg">
              No review data available.
            </p>
          ) : (
            <ul className="space-y-6">
              {reviewData.map((item) => (
                <li
                  key={item._id}
                  className="p-6 border border-blue-100 rounded-lg bg-blue-50/80 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p className="font-semibold text-lg mb-2 text-blue-900">
                    Question: {item.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-white/80 rounded-lg border border-blue-100">
                      <p className="text-blue-700 font-medium">Your Answer:</p>
                      <p className="mt-1">{item.answer}</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-lg border border-blue-100">
                      <p className="text-green-600 font-medium">
                        Expected Answer:
                      </p>
                      <p className="mt-1">{item.expectedAnswer}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div
                      className={`flex flex-col px-5 justify-center rounded-xl ${
                        item.correctness >= 7
                          ? "bg-green-100 text-green-700"
                          : item.correctness >= 4
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      } font-medium inline-block`}
                    >
                      Correctness: <h1 className="text-center">{item.correctness}</h1>
                    </div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 font-medium">Feedback:</p>
                      <p className="mt-1">
                        {item.feedback || "No feedback provided."}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
