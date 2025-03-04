"use server";

import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (token) {
    redirect("/jobs");
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
