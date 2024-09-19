import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";

export function useUser() {
  const context = useContext(UserContext);
  if (!context.user) {
    throw new Error(`UserProvider must be at the parent level`);
  }
  return {
    user: context.user,
    hasPassword: context.hasPassword,
  };
}
