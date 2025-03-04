"use server";

import { LogOut, LogIn } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function handleLogOut() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/login");
}

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  return (
    <nav className="bg-white w-full z-20 sticky top-0 h-[10%] left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-14">
          <div className="flex justify-between gap-5 items-center">
            <h1 className="text-2xl font-semibold tracking-widest text-gray-800">
              PINTERVIEW
            </h1>
            <div className="flex gap-5">
              <Link href={"/jobs"}>
                <h1 className="text-lg tracking-wide hover:underline">Jobs</h1>
              </Link>
              <Link href={"/purchase"}>
                <h1 className="text-lg tracking-wide hover:underline">
                  Purchase Quota
                </h1>
              </Link>
            </div>
          </div>

          {token ? (
            <form action={handleLogOut}>
              <button className="btn flex items-center gap-2">
                <LogOut /> Log Out
              </button>
            </form>
          ) : (
            <Link href="/login">
              <button className="btn flex items-center gap-2">
                <LogIn /> Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
