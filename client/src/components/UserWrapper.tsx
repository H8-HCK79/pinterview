// components/UserWrapper.tsx
"use client";

import { UserProvider } from "@/context/UserContext";

export default function UserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
