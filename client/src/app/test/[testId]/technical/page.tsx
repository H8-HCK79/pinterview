"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface IQuestion {
  _id: string;
  question: string;
}

interface IAnswer {
  _id: string;
  answer: string;
}

export default function TechnicalPage() {
  const params = useParams();
  const testId = params?.testId;
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [technicalQuestions, setTechnicalQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  console.log(answers);

  useEffect(() => {
    async function fetchTechnicalQuestions() {
      if (!testId) {
        setError("Test ID is missing!");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/technicals`
        );
        if (!res.ok) throw new Error("Failed to fetch technical questions.");

        const data: { data: IQuestion[] } = await res.json();

        if (!data.data || data.data.length === 0) {
          throw new Error("No technical questions found.");
        }

        setTechnicalQuestions(data.data);
        setAnswers(data.data.map((q) => ({ _id: q._id, answer: "" })));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchTechnicalQuestions();
  }, [testId]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setAnswers((prevAnswers) =>
        prevAnswers.map((a, index) =>
          index === currentQuestion ? { ...a, answer: value } : a
        )
      );
    }
  };

  const handleNext = () => {
    if (currentQuestion < technicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmNextPage = async () => {
    setShowConfirmation(false);
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/questions`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      }
    );
    router.push(`/test/${testId}/review`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white text-lg">
        Loading technical questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#0077b6] to-[#023e8a] relative">
      <div className="w-full max-w-3xl px-4 flex items-center justify-center">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestion === 0}
          className="bg-black text-white rounded-full p-3 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Question {currentQuestion + 1}
          </h2>
          <p className="text-gray-700 mb-4">
            {technicalQuestions[currentQuestion]?.question ||
              "Question not found"}
          </p>

          <div className="border rounded-md overflow-hidden">
            <MonacoEditor
              height="200px"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={answers[currentQuestion]?.answer || ""}
              onChange={handleCodeChange}
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          className="bg-black text-white rounded-full p-3"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              You have completed all questions. Proceed to the Review Page?
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmNextPage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
