"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Answer {
  _id: string;
  answer: string;
}

interface AnswerContextType {
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  updateAnswer: (questionId: string, text: string) => void;
  initializeAnswers: (questions: { _id: string }[]) => void;
}

const AnswerContext = createContext<AnswerContextType | undefined>(undefined);

export const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Initialize answers with dynamic _id from conceptQuestions
  const initializeAnswers = (questions: { _id: string }[]) => {
    setAnswers(questions.map((q) => ({ _id: q._id, answer: "" })));
  };

  // Update answer based on _id instead of index
  const updateAnswer = (questionId: string, text: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans._id === questionId ? { ...ans, answer: text } : ans
      )
    );
  };

  return (
    <AnswerContext.Provider
      value={{ answers, setAnswers, updateAnswer, initializeAnswers }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

export const useAnswerContext = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error("useAnswerContext must be used within an AnswerProvider");
  }
  return context;
};
