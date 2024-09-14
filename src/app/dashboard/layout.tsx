import { ReactNode } from "react";
import SignOut from "@/components/auth/SignOut";
import { authorized } from "@/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  await authorized();
  return (
    <div>
      <SignOut />
      {children}
    </div>
  );
}
