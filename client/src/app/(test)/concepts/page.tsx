"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

// Sample questions for demonstration
const sampleQuestions = [
  "Tell me about a time you faced a challenge at work.",
  "What are your greatest strengths?",
  "Why do you want to work for this company?",
  "Describe a situation where you had to solve a difficult problem.",
  "How do you handle pressure or stressful situations?",
];

export default function ConceptTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>(
    Array(sampleQuestions.length).fill("")
  );

  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  // Update userAnswer when speech recognition text changes
  useEffect(() => {
    if (!isListening && text) {
      setUserAnswer(text);
    }
  }, [text, isListening]);

  const handlePrevQuestion = () => {
    // Save current answer before moving
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = userAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer(newAnswers[currentQuestionIndex - 1]); // Load previous answer
    }
  };

  const handleNextQuestion = () => {
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = userAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(newAnswers[currentQuestionIndex + 1] || ""); // Load next answer if it exists
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#0077b6] to-[#023e8a]">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full"></div>

      <div className="w-full max-w-2xl px-4 flex items-center justify-center">
        {/* Left navigation button */}
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

        {/* Main content container */}
        <div className="flex-1">
          <div className="border border-gray-300 rounded-lg bg-white p-6 shadow-md">
            <div className="relative min-h-64 mb-4">
              {/* AI Question */}
              <div className="absolute left-0 top-5 max-w-[70%]">
                <div className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800">
                  <p className="font-medium">AI QUESTION</p>
                  <p>{sampleQuestions[currentQuestionIndex]}</p>
                </div>
              </div>

              {/* User Answer Display */}
              {userAnswer && (
                <div className="absolute right-0 top-28 max-w-[70%]">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800">
                    <p className="font-medium">USER ANSWER</p>
                    <p>{userAnswer}</p>
                  </div>
                </div>
              )}

              {/* Mic Button */}
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

            {/* Text input area */}
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

            {/* Question counter */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {sampleQuestions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Right navigation button */}
        <button
          onClick={handleNextQuestion}
          className="flex items-center justify-center w-12 h-12 rounded-full ml-4 bg-black text-white hover:bg-gray-800"
          aria-label="Next question"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
