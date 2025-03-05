"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.has("access_token");

  if (!isAuth) {
    redirect("/login");
  }

  return (
    <>
      <main>{children}</main>;
    </>
  );
}
