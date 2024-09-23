import { ReactNode } from "react";
import { authenticated } from "@/auth";
import UserProvider from "@/providers/UserProvider";
import { createReadableContainerSas } from "@/lib/uploader/azure";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user, hasPassword } = await authenticated();
  const sasToken = createReadableContainerSas({
    containerName: "global",
  });
  return (
    <UserProvider sasToken={sasToken} hasPassword={hasPassword} user={user}>
      {children}
    </UserProvider>
  );
}
