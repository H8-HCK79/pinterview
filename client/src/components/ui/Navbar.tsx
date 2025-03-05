"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { LogOut, LogIn, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/app/(sign)/actions";

export default function Navbar() {
  const { user, fetchUser } = useUser(); // Get fetchUser from context

  return (
    <nav className="bg-white shadow-md w-full z-20 sticky top-0 h-[10%] left-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-2xl font-bold tracking-wide text-blue-500">
                PINTERVIEW
              </h1>
            </Link>
            <div className="flex gap-4 text-gray-600 font-medium">
              <Link href="/jobs" className="hover:text-gray-900 transition">
                Jobs
              </Link>
              <Link
                href="/purchase"
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <CreditCard size={18} />
                Purchase Quota
              </Link>
            </div>
          </div>

          {/* Right Section - User Info */}
          {user ? (
            <div className="flex items-center gap-6">
              {/* Quota Display */}
              <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <CreditCard size={20} className="text-blue-500" />
                <span>{user.quota}</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 text-lg font-medium">
                <User size={20} className="text-gray-700" />
                <span>{user.fullName}</span>
              </div>

              {/* Logout Button */}
              <form action={logoutUser}>
                <button className="btn bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition">
                  <LogOut size={18} />
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <button className="btn bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition">
                <LogIn size={18} />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
