"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IQuestion } from "@/interfaces/IQuestion";
import { useAnswerContext } from "@/context/AnswerContext";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useSecondsContext } from "@/context/SecondsContext";

export default function ConceptTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId;

  const { answers, setAnswers, updateAnswer } = useAnswerContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conceptQuestions, setConceptQuestions] = useState<
    { _id: string; question: string }[]
  >([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const { seconds, setSeconds, isPlaying, setIsPlaying } = useSecondsContext();

  console.log(answers);

  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const savedPlaying = localStorage.getItem("is_playing");
  useEffect(() => {
    if (savedPlaying === "false") {
      router.push(`/test/${testId}/review`);
    }
  }, []);

  useEffect(() => {
    async function fetchConceptQuestions() {
      if (!testId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}/concepts`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: { data: IQuestion[] } = await res.json();
        const formattedData = data.data.map((el) => ({
          _id: el._id.toString(),
          question: el.question,
        }));

        setConceptQuestions(formattedData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchConceptQuestions();
  }, [testId]);

  useEffect(() => {
    if (conceptQuestions.length > 0) {
      setAnswers(conceptQuestions.map((q) => ({ _id: q._id, answer: "" })));
    }
  }, [conceptQuestions, setAnswers]);

  useEffect(() => {
    if (!isListening && text) {
      setUserAnswer(text);
    }
  }, [text, isListening]);

  const handlePrevQuestion = () => {
    updateAnswer(conceptQuestions[currentQuestionIndex]._id, userAnswer);

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = answers.find(
        (ans) => ans._id === conceptQuestions[currentQuestionIndex - 1]._id
      );
      setUserAnswer(prevAnswer ? prevAnswer.answer : "");
    }
  };

  const handleNextQuestion = () => {
    updateAnswer(conceptQuestions[currentQuestionIndex]._id, userAnswer);

    if (currentQuestionIndex < conceptQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextAnswer = answers.find(
        (ans) => ans._id === conceptQuestions[currentQuestionIndex + 1]._id
      );
      setUserAnswer(nextAnswer ? nextAnswer.answer : "");
    } else {
      setShowConfirmation(true); // ✅ Show popup on last question
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
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
    router.push(`/test/${testId}/technical`);
  };

  const handleCancel = () => {
    setShowConfirmation(false); // ✅ Closes the popup
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
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

  if (!conceptQuestions.length) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#0077b6] to-[#023e8a]">
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full"></div>

      <div className="w-full max-w-2xl px-4 flex items-center justify-center">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
            currentQuestionIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
          aria-label="Previous question"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1">
          <div className="border border-gray-300 rounded-lg bg-white p-6 shadow-md">
            <div className="relative min-h-64 mb-4">
              <div className="absolute left-0 top-5 max-w-[70%]">
                <div className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800">
                  <p className="font-medium">Interviewer Question:</p>
                  <p>{conceptQuestions[currentQuestionIndex]?.question}</p>
                </div>
              </div>

              {userAnswer && (
                <div className="absolute right-0 top-28 max-w-[70%]">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800">
                    <p className="font-medium">USER ANSWER</p>
                    <p>{userAnswer}</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                {hasRecognitionSupport ? (
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-full transition ${
                      isListening
                        ? "bg-red-400 hover:bg-red-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={
                      isListening ? "Stop listening" : "Start listening"
                    }
                  >
                    <Mic size={20} color={isListening ? "white" : "black"} />
                  </button>
                ) : (
                  <p className="text-sm text-red-500">
                    Speech recognition not supported
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  isListening
                    ? "Listening... Speak your answer"
                    : "Type your answer here..."
                }
                value={userAnswer}
                onChange={handleAnswerChange}
                disabled={isListening}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {conceptQuestions.length}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNextQuestion}
          className="flex items-center justify-center w-12 h-12 rounded-full ml-4 bg-black text-white hover:bg-gray-800"
          aria-label="Next question"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="flex items-center justify-center h-screen bg-gray-900">
        <h1 className="text-white text-6xl font-bold bg-gray-800 px-8 py-4 rounded-2xl shadow-lg">
          Time Left: <span className="text-red-400">{seconds}s</span>
        </h1>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              You have completed all concept questions. Proceed to the Technical
              Test?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNextPage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
