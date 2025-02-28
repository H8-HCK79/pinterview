import { IUser } from "@/interfaces/IUser";
import { useMemo } from "react";

export function useSubscriptionStatus(user: IUser | null) {
  return useMemo(() => {
    if (!user) return false;
    return user.quota > 0;
  }, [user]);
}

export default function Profile({ user }: { user: IUser | null }) {
  const isSubscribed = useSubscriptionStatus(user);

  return (
    <div>
      <h2>{user?.fullName}</h2>
      <p>Status: {isSubscribed ? "Subscribed" : "Not Subscribed"}</p>
    </div>
  );
}
