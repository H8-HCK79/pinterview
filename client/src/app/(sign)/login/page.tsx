"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { ZodError } from "zod";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  async function handleCredentialResponse(response: any) {}

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
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
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }
  return (
    <>
      <script src="https://accounts.google.com/gsi/client"></script>
      <div>
        {error ? (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! {error}</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Submit" className="btn" />
        </form>
      </div>
      ;
    </>
  );
}
