import { ReactNode } from "react";
import { authenticated } from "@/auth";
import UserProvider from "@/providers/UserProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await authenticated();
  return <UserProvider user={user}>{children}</UserProvider>;
}
