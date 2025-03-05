import { AnswerProvider } from "@/context/AnswerContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnswerProvider>{children}</AnswerProvider>;
}
