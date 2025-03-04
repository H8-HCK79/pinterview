import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Navbar() {
  async function handleLogOut() {
    "use server";

    const cookieStore = cookies();
    (await cookieStore).delete("access_token");
    redirect("/login");
  }
  return (
    <nav className="bg-white  w-full z-20  sticky top-0 h-[10%] left-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-14">
          <div className="flex justify-between gap-5 items-center">
            <h1 className="text-2xl font-semibold tracking-widest text-gray-800">
              PINTERVIEW
            </h1>
            <div className="flex gap-5">
              <Link href={'/jobs'}>
                <h1 className="text-lg tracking-wide hover:underline">Jobs</h1>
              </Link>
              <Link href={'/purchase'}>
              <h1 className="text-lg tracking-wide hover:underline">Purchase</h1>
              </Link>
            </div>
          </div>

          <form action={handleLogOut}>
            <button className="btn">
              {" "}
              <LogOut /> Log Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
