"use client";
import { UserSchema } from "@/db/models/users";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { ZodError } from "zod";

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ Perbaiki header
          },
          body: JSON.stringify({ fullName, email, password, birthDate }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message); // ❌ Hindari redirect jika ada error
      }

      router.push("/login"); // ✅ Pindah hanya jika sukses
    } catch (error: unknown) {
      if (error instanceof Error) {
        //  console.log(error.message,"INI DANISH");

        setError(error.message);
      }
    }
  }

  return (
    <div>
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
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
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
          <input
            type="date" // ✅ Ganti jadi date
            placeholder="Birth date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <input type="submit" value="Submit" className="btn" />
        </form>
      </div>
    </div>
  );
}
