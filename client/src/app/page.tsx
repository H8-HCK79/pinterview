
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";



export default function Home() {
  
  return (

    <div>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <h2 className="bg-clip-text  text-gray-800 text-2xl text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white  md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          Ace Your Next Interview <br /> with Pinterview
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          Get the best advices from our experts, including expert artists,
          painters, marathon enthusiasts and RDX, totally free.
        </p>
        <Button className="px-5  bg-[#0077b6] relative z-50 text-white font-sans mt-5 text-xl border-indigo-500 hover:bg-[#00b4d8]">
          Get Started
        </Button>
      </BackgroundLines>


    </div>
  );
}
