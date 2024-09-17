import { ReactNode } from "react";
import SignOut from "@/components/auth/SignOut";
import { authenticated } from "@/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  await authenticated();
  return (
    <div>
      <SignOut />
      {children}
    </div>
  );
}
