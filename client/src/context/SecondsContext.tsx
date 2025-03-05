"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SecondsContextType {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const SecondsContext = createContext<SecondsContextType | undefined>(undefined);

export const useSecondsContext = () => {
  const context = useContext(SecondsContext);
  if (!context) {
    throw new Error("useSecondsContext must be used within a SecondsProvider");
  }
  return context;
};

interface SecondsProviderProps {
  children: ReactNode;
}

export const SecondsProvider: React.FC<SecondsProviderProps> = ({
  children,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <SecondsContext.Provider
      value={{ seconds, setSeconds, isPlaying, setIsPlaying }}
    >
      {children}
    </SecondsContext.Provider>
  );
};
