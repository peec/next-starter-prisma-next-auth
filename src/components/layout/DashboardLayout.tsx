import { FileIcon, Home, Users } from "lucide-react";

import { ReactNode } from "react";
import { Organization, OrganizationMember, User } from "@prisma/client";
import { MenuItem } from "@/components/layout/types";
import OrganizationSelector from "@/components/layout/OrganizationSelector";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { SasToken } from "@/lib/uploader/types";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function DashboardLayout({
  children,
  organization,
  user,
  organizationMember,
  organizations,
  authSasToken,
}: {
  organizationMember: OrganizationMember;
  user: Omit<User, "password">;
  children: ReactNode;
  organization: Organization;
  organizations: Organization[];
  authSasToken: SasToken | null;
}) {
  const t = await getTranslations("layout");
  const orgUrl = `/dashboard/${organization.slug}`;
  const menu: MenuItem[] = [
    {
      href: orgUrl,
      name: t("menu.dashboard"),
      iconDesktop: <Home className="h-4 w-4" />,
      iconMobile: <Home className="h-5 w-5" />,
    },
    {
      href: `${orgUrl}/documents`,
      name: t("menu.documents"),
      iconDesktop: <FileIcon className="h-4 w-4" />,
      iconMobile: <FileIcon className="h-5 w-5" />,
      roles: ["OWNER", "MEMBER"],
    },
    {
      href: `${orgUrl}/members`,
      name: t("menu.members"),
      iconDesktop: <Users className="h-4 w-4" />,
      iconMobile: <Users className="h-5 w-5" />,
      roles: ["OWNER"],
    },
  ];

  return (
    <AuthenticatedLayout
      sasToken={authSasToken}
      homeUrl={orgUrl}
      user={user}
      sidebarBottom={
        <OrganizationSelector
          organizations={organizations}
          organization={organization}
        />
      }
      header={
        <>
          <div className="flex items-center gap-2">
            {organization.image ? (
              <Image
                src={organization.image}
                alt={organization.name}
                width={100}
                height="0"
                className="h-7 w-auto my-auto"
              />
            ) : (
              <span className="hidden sm:block text-muted-foreground text-sm font-semibold">
                {organization.name}
              </span>
            )}
          </div>
        </>
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
