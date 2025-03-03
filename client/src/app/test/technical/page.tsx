"use client"
import { useState } from "react"
import PlayGround from "@/components/ui/PlayGround"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TechnicalPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [code, setCode] = useState<string[]>(
    Array(5).fill(
      "// Write your code here\nfunction solution() {\n  // Your implementation\n  \n  return result;\n}\n",
    ),
  )

  const questions = [
    {
      id: 1,
      title: "Array Manipulation",
      description:
        "Write a function that takes an array of integers and returns the sum of all positive integers in the array.",
      example: "Input: [-1, 2, 3, -4, 5]\nOutput: 10 (2 + 3 + 5)",
      constraints: [
        "The array length will be between 1 and 10^5",
        "Array elements will be between -10^9 and 10^9",
        "Your solution should have O(n) time complexity",
      ],
    },
    {
      id: 2,
      title: "String Reversal",
      description: "Implement a function that reverses a string without using the built-in reverse method.",
      example: 'Input: "hello world"\nOutput: "dlrow olleh"',
      constraints: [
        "The string length will be between 1 and 10^4",
        "The string will contain ASCII characters",
        "Your solution should have O(n) time complexity and O(1) space complexity",
      ],
    },
    {
      id: 3,
      title: "Find Missing Number",
      description:
        "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one number that is missing from the array.",
      example: "Input: [3, 0, 1]\nOutput: 2",
      constraints: [
        "The array size will be between 1 and 10^4",
        "The values will be between 0 and n",
        "Each number except for the missing one appears exactly once",
      ],
    },
    {
      id: 4,
      title: "Palindrome Check",
      description:
        "Write a function that checks if a given string is a palindrome (reads the same backward as forward), considering only alphanumeric characters and ignoring case.",
      example: 'Input: "A man, a plan, a canal: Panama"\nOutput: true',
      constraints: [
        "The string length will be between 1 and 10^5",
        "The string will contain ASCII characters",
        "Ignore non-alphanumeric characters and case sensitivity",
      ],
    },
    {
      id: 5,
      title: "Two Sum Problem",
      description:
        "Given an array of integers and a target sum, return the indices of two numbers such that they add up to the target.",
      example: "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)",
      constraints: [
        "The array length will be between 2 and 10^4",
        "Array elements will be between -10^9 and 10^9",
        "Each input will have exactly one solution",
        "You may not use the same element twice",
      ],
    },
  ]

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      const newCode = [...code]
      newCode[currentQuestion] = value
      setCode(newCode)
    }
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Questions */}
      <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto flex flex-col">
        <h1 className="text-2xl font-bold text-[#0077b6] mb-6">Technical Assessment</h1>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#0077b6] text-white px-2 py-1 rounded-md text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-3">
            Problem {currentQuestion + 1}: {currentQuestionData.title}
          </h2>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <p className="mb-3">{currentQuestionData.description}</p>
            <div className="mb-3">
              <h3 className="font-medium mb-1">Example:</h3>
              <pre className="bg-black text-white p-3 rounded-md overflow-x-auto">
                <code>{currentQuestionData.example}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-1">Constraints:</h3>
              <ul className="list-disc list-inside">
                {currentQuestionData.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#0077b6]/10 p-4 rounded-md">
            <h3 className="font-medium mb-2">Instructions:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Implement your solution in the editor on the right</li>
              <li>
                Your function should be named <code className="bg-gray-100 px-1 py-0.5 rounded">solution</code>
              </li>
              <li>You can test your code with different inputs</li>
              <li>Your code will be saved as you type</li>
            </ul>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-200">
          {/* <div className="text-sm text-gray-500">
            <p>Time remaining: 45:00</p>
          </div> */}

          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                currentQuestion === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#0077b6] text-white hover:bg-[#0077b6]/90"
              }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                currentQuestion === questions.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#0077b6] text-white hover:bg-[#0077b6]/90"
              }`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Code Editor */}
      <div className="w-1/2">
        <PlayGround code={code[currentQuestion]} onChange={handleCodeChange} />
      </div>
    </div>
  )
}

