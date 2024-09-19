"use client";
import React, { ReactNode } from "react";
import { User } from "@prisma/client";

export const UserContext = React.createContext<{
  user: Omit<User, "password"> | null;
  hasPassword: boolean;
}>({
  user: null,
  hasPassword: false,
});

export default function UserProvider({
  user,
  hasPassword,
  children,
}: {
  user: Omit<User, "password">;
  hasPassword: boolean;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, hasPassword }}>
      {children}
    </UserContext.Provider>
  );
}
