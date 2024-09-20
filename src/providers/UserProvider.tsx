"use client";
import React, { ReactNode } from "react";
import { User } from "@prisma/client";
import { SasToken } from "@/lib/uploader/types";

export const UserContext = React.createContext<{
  user: Omit<User, "password"> | null;
  hasPassword: boolean;
  sasToken: SasToken | null;
}>({
  user: null,
  hasPassword: false,
  sasToken: null,
});

export default function UserProvider({
  user,
  hasPassword,
  sasToken,
  children,
}: {
  sasToken: SasToken | null;
  user: Omit<User, "password">;
  hasPassword: boolean;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ sasToken, user, hasPassword }}>
      {children}
    </UserContext.Provider>
  );
}
