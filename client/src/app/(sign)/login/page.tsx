"use client";


import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function handleCredentialResponse(response: any) {}

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: data.message,
      });
    }

    // const cookieStore = await cookies();
    // cookieStore.set("access_token", data.access_token);
    router.push("/");
  }
  return (
    <>
      <script src="https://accounts.google.com/gsi/client"></script>
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
