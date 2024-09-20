import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { MenuItem } from "@/components/layout/types";
import { ArrowLeftIcon, Home, LockOpen, UserPenIcon } from "lucide-react";
import { ReactNode } from "react";
import { authenticated } from "@/auth";
import UserProvider from "@/providers/UserProvider";
import { createReadableContainerSas } from "@/lib/uploader/azure";

const homeUrl = `/account`;
const menu: MenuItem[] = [
  {
    href: "/dashboard",
    name: "Back to dashboard",
    iconDesktop: <ArrowLeftIcon className="h-4 w-4" />,
    iconMobile: <Home className="h-5 w-5" />,
  },
  {
    href: homeUrl,
    name: "Profile",
    iconDesktop: <UserPenIcon className="h-4 w-4" />,
    iconMobile: <UserPenIcon className="h-5 w-5" />,
  },
  {
    href: `${homeUrl}/password`,
    name: "Change password",
    iconDesktop: <LockOpen className="h-4 w-4" />,
    iconMobile: <LockOpen className="h-5 w-5" />,
  },
];
export default async function Layout({ children }: { children: ReactNode }) {
  const { user, hasPassword } = await authenticated();
  const sasToken = createReadableContainerSas({
    containerName: "global",
  });
  return (
    <UserProvider sasToken={sasToken} user={user} hasPassword={hasPassword}>
      <AuthenticatedLayout
        sasToken={sasToken}
        title="Account"
        user={user}
        homeUrl={homeUrl}
        menu={menu}
      >
        {children}
      </AuthenticatedLayout>
    </UserProvider>
  );
}
