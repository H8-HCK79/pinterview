import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default function Navbar() {
  async function handleLogOut() {
    "use server";

    const cookieStore = cookies();
    (await cookieStore).delete("token");
    redirect("/login");
  }

  return (
    <>
      <nav>
        <form action={handleLogOut}>
          <button className="btn">Log Out</button>
        </form>
      </nav>
    </>
  );
}
