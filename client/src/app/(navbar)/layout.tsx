// layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import UserWrapper from "@/components/UserWrapper";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.has("access_token");

  if (!isAuth) {
    redirect("/login");
  }

  return (
    <UserWrapper>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar /> {/* Navbar now has access to useUser() */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </UserWrapper>
  );
}
