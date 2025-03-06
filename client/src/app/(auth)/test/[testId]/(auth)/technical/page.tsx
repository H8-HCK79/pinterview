"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useSecondsContext } from "@/context/SecondsContext";
import { ITest } from "@/interfaces/ITest";
import DebugButton from "@/components/DebugButton";
import { IQuestion } from "@/interfaces/IQuestion";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

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
  const [showPreviousConfirmation, setShowPreviousConfirmation] = useState(false);
  const [showNextConfirmation, setShowNextConfirmation] = useState(false);
  const { seconds, setSeconds, isPlaying, setIsPlaying } = useSecondsContext();

  console.log(answers);

  const savedPlaying = localStorage.getItem("is_playing");
  useEffect(() => {
    if (savedPlaying === "false") {
      router.push(`/test/${testId}/review`);
    }
  }, []);

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
        setAnswers(data.data.map((q) => ({ _id: q._id.toString(), answer: q.answer })));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchTechnicalQuestions();
  }, [testId]);

  const [category, setCategory] = useState<string>("");
  useEffect(() => {
    async function fetchCategory() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}`,
        {
          method: "GET",
        }
      );
      const data: ITest = (await res.json()).data;
      setCategory(data.category.toLowerCase());
    }
    fetchCategory();
  }, []);

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
      setShowNextConfirmation(true);
    }
  };

  const handleConfirmPreviousPage = async () => {
    setShowPreviousConfirmation(false);
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
    router.push(`/test/${testId}/concept`);
  };

  const handleConfirmNextPage = async () => {
    setShowNextConfirmation(false);
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
    setSeconds(0); // Reset the timer
    setIsPlaying(false);
    router.push(`/test/${testId}/review`);
  };

  // Load `seconds` and `isPlaying` from localStorage on mount
  useEffect(() => {
    const savedSeconds = localStorage.getItem("remaining_seconds");
    const savedPlaying = localStorage.getItem("is_playing");

    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds, 10));
    }
    if (savedPlaying === "true") {
      setIsPlaying(true);
    }
  }, []);

  // Save `seconds` & `isPlaying` to localStorage every second
  useEffect(() => {
    localStorage.setItem("remaining_seconds", seconds.toString());
    localStorage.setItem("is_playing", isPlaying.toString());
  }, [seconds, isPlaying]);

  // Countdown timer
  useEffect(() => {
    if (!isPlaying || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, seconds]);

  // Redirect when timer hits 0
  useEffect(() => {
    if (seconds <= 0 && isPlaying) {
      setIsPlaying(false);
      router.push(`/test/${testId}/review`);
    }
  }, [seconds, isPlaying, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-medium text-foreground sm:text-2xl">
            Loading technical questions...
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your next test
          </p>
        </div>
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-500 to-red-700 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-red-400 opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-red-300 opacity-20 blur-xl"></div>
      <div className="absolute -top-10 right-40 w-40 h-40 rounded-full bg-red-200 opacity-20 blur-lg"></div>
      <div className="absolute -bottom-10 left-40 w-56 h-56 rounded-full bg-red-600 opacity-20 blur-xl"></div>

      <div className="w-full max-w-3xl px-4 flex items-center justify-center">
        <button
          onClick={() => {
            if (currentQuestion === 0) {
              setShowPreviousConfirmation(true);
            } else {
              setCurrentQuestion((prev) => Math.max(prev - 1, 0));
            }
          }}
          className="bg-black text-white rounded-full p-3"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Interviewer Question {currentQuestion + 6}
          </h2>
          <p className="text-gray-700 mb-4">
            {technicalQuestions[currentQuestion]?.question ||
              "Question not found"}
          </p>

          <div className="border rounded-md overflow-hidden">
            <MonacoEditor
              height="200px"
              defaultLanguage={category}
              theme="vs-dark"
              value={answers[currentQuestion]?.answer || ""}
              onChange={handleCodeChange}
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          className="bg-black text-white rounded-full p-3 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="rounded-lg bg-white px-4 py-2 shadow-md">
        <div className="rounded-lg bg-white px-4 py-2 shadow-md mb-4">
          <h1 className="text-center font-bold text-red-700 font-mono text-2xl">
            Technical Test:
          </h1>
          <h1 className="text-center font-mono text-2xl font-medium text-gray-900">
            {category.toUpperCase()}
          </h1>
          <h1 className="text-start font-mono text-2xl font-medium text-gray-900">
            Time Left:
            <span className="text-red-500">
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
            </span>
          </h1>
        </div>
      </div>

      {showPreviousConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to go back? Your progress will be saved.
            </p>
            <button
              onClick={() => setShowPreviousConfirmation(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPreviousPage}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {showNextConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              You have completed all questions. Proceed to the Review Page?
            </p>
            <button
              onClick={() => setShowNextConfirmation(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmNextPage}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      <DebugButton />
    </div>
  );
}
