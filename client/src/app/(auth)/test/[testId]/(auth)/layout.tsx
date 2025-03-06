import { redirect } from "next/navigation";

export type Params = Promise<{ testId: string }>;
export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { testId } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${testId}`,
    { method: "GET" }
  );
  const isReviewed = (await data.json()).data.isReviewed; ;
  if (isReviewed) {
    redirect(`/test/${testId}/review`);
  }
    return (
      <>
        <main>{children}</main>;
      </>
    );
}
