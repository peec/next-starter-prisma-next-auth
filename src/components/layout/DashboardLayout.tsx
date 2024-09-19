import { Home, Search, Users } from "lucide-react";

import { ReactNode } from "react";
import { Organization, OrganizationMember, User } from "@prisma/client";
import { MenuItem } from "@/components/layout/types";
import OrganizationSelector from "@/components/layout/OrganizationSelector";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Input } from "@/components/ui/input";

export function DashboardLayout({
  children,
  organization,
  user,
  organizationMember,
  organizations,
}: {
  organizationMember: OrganizationMember;
  user: Omit<User, "password">;
  children: ReactNode;
  organization: Organization;
  organizations: Organization[];
}) {
  const orgUrl = `/dashboard/${organization.slug}`;
  const menu: MenuItem[] = [
    {
      href: orgUrl,
      name: "Dashboard",
      iconDesktop: <Home className="h-4 w-4" />,
      iconMobile: <Home className="h-5 w-5" />,
    },
    {
      href: `${orgUrl}/members`,
      name: "Members",
      iconDesktop: <Users className="h-4 w-4" />,
      iconMobile: <Users className="h-5 w-5" />,
      roles: ["OWNER"],
    },
  ];

  return (
    <AuthenticatedLayout
      homeUrl={orgUrl}
      user={user}
      sidebarBottom={
        <OrganizationSelector
          organizations={organizations}
          organization={organization}
        />
      }
      header={
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      }
      menu={menu.filter(
        (item) =>
          !(item.roles && !item.roles.includes(organizationMember.role)),
      )}
    >
      {children}
    </AuthenticatedLayout>
  );
}
