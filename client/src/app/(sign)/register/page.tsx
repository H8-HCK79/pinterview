"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";


export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
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
      console.log(process.env.NEXT_PUBLIC_BASE_URL, "OOOOO");

      console.log("Response Status:", response.status);

      // Debug response sebelum parsing
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      const data = JSON.parse(responseText);
      console.log("Parsed Data:", data);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: data.message || "Something went wrong",
        });
        return; // ❌ Hindari redirect jika ada error
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registration successful!",
      });

      router.push("/login"); // ✅ Pindah hanya jika sukses
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="date" // ✅ Ganti jadi date
          placeholder="Birth date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <input type="submit" value="Submit" className="btn" />
      </form>
    </div>
  );
}
