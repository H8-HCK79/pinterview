'use client'
import { Cover } from "@/components/ui/cover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, password, birthDate }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  return (
    <div className="flex items-center justify-around min-h-screen bg-gradient-to-br from-[#0077b6] to-[#023e8a]">
      <div className="w-2/3 flex flex-col items-center justify-center text-white p-10">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-white bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
         Welcome to <Cover>Pinterview!</Cover>
        </h1>

        <p className="max-w-xl mx-auto text-lg md:text-lg font-bold text-white text-center">
          Sign up and start your journey with Pinterview
        </p>
      </div>

      <div className="bg-white p-8 min-h-screen shadow-lg text-black">
        <div className="flex flex-col py-20">
          <h2 className="text-3xl font-bold text-center mb-4">Register</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account? <br />
            <Link href="/login" className="text-blue-300 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
