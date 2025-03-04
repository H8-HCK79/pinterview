"use client";
import { Cover } from "@/components/ui/cover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  async function handleCredentialResponse(
    response: any,
    e: React.FormEvent<HTMLFormElement>
  ) {
    console.log(response.credential, "INI CREDENTIAL");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.credential }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": `application/json`,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      console.log(response,"INI RESPON");
      
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  return (
    <div className="flex  items-center justify-around min-h-screen bg-gradient-to-br from-[#0077b6] to-[#023e8a]">
      <div>
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-white bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Welcome to <Cover>Pinterview!</Cover>
        </h1>

        <p className="max-w-xl mx-auto text-lg md:text-lg font-bold text-white text-center">
          Ace your interview with Pinterview
        </p>
      </div>

      <div className="bg-white p-8  min-h-screen shadow-lg  text-black">
        <div className="flex flex-col py-20">
          <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
          <div
            id="googleSignInButton"
            className="flex items-center justify-center mt-5 rounded-full"
          ></div>
          <p className="text-center mt-4">
            Don't have an account? <br />
            <Link href="/register" className="text-blue-300 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
