import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { authorizedOrganization } from "@/auth";
import { prisma } from "@/lib/prisma";
import OrganizationProvider from "@/providers/OrganizationProvider";

export default async function RootLayout({
  params: { orgSlug },
  children,
}: Readonly<{
  params: { orgSlug: string };
  children: React.ReactNode;
}>) {
  const { organization, user, organizationMember } =
    await authorizedOrganization(orgSlug);
  const organizations = await prisma.organization.findMany({
    where: {
      organizationMembers: {
        some: {
          userId: user.id,
        },
      },
    },
  });
  return (
    <OrganizationProvider
      organization={organization}
      organizationMember={organizationMember}
    >
      <DashboardLayout
        organizationMember={organizationMember}
        user={user}
        organization={organization}
        organizations={organizations}
      >
        {children}
      </DashboardLayout>
    </OrganizationProvider>
  );
}
