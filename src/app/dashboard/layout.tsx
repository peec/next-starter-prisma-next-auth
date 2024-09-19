import { ReactNode } from "react";
import { authenticated } from "@/auth";
import UserProvider from "@/providers/UserProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user, hasPassword } = await authenticated();
  return (
    <UserProvider hasPassword={hasPassword} user={user}>
      {children}
    </UserProvider>
  );
}
