import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.has("access_token");

  if (isAuth) {
    redirect("/jobs");
  }

  return (
    <>
      <main>{children}</main>;
    </>
  );
}
