"use client";
import React, { ReactNode } from "react";
import { User } from "@prisma/client";

export const UserContext = React.createContext<{
  user: Omit<User, "password"> | null;
}>({
  user: null,
});

export default function UserProvider({
  user,
  children,
}: {
  user: Omit<User, "password">;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
