"use client";


import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { ZodError } from "zod";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] =useState('')
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

    const data = await response.json();
    if (!response.ok) {
      throw response
    }
    router.push("/");
   } catch (error:unknown) {
    if(error instanceof ZodError) {
     setError(error.issues[0].message) 
    }
   }
  }
  return (
    <>
      <script src="https://accounts.google.com/gsi/client"></script>

    <div>
      
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
