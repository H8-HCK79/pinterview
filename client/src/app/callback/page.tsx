'use client'

import { LucideChartNoAxesColumnDecreasing } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/purchase")
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="flex flex-col items-center gap-4 text-center">
        <LucideChartNoAxesColumnDecreasing className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">
          Adding quota...
        </h2>
      </div>
    </div>
  );
}