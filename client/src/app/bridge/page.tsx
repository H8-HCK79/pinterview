import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";

export default function InterviewIntro() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-[#0077b6] text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold mb-4">
              Welcome to Your Golang Interview Preparation
            </h1>
            <p className="text-lg">We wish you the best of luck!</p>
          </motion.div>
        </div>
        <CardContent className="w-full md:w-1/2 p-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Test Information</h2>
            <p className="mb-6">
              This test consists of 5 Concept Questions and 5 Technical
              Questions. Please read the instructions carefully before
              proceeding.
            </p>
            <Button className="bg-[#0077b6] hover:bg-[#005f8c] text-white px-6 py-2 rounded-lg">
              Start Test
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
