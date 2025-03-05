"use client";

import { IUser } from "@/interfaces/IUser";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type UserContextType = {
  user: IUser | null;
  fetchUser: () => Promise<void>; // Expose fetchUser in context
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data: IUser = (await res.json()).data;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  useEffect(() => {
    fetchUser(); // Fetch user on mount
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
