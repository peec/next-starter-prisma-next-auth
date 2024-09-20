import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { authorizedOrganization } from "@/auth";
import { prisma } from "@/lib/prisma";
import OrganizationProvider from "@/providers/OrganizationProvider";
import { createReadableContainerSas } from "@/lib/uploader/azure";

export default async function OrgLayout({
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
  const orgSasToken = createReadableContainerSas({
    containerName: `org-${organization.id}`,
  });
  const authSasToken = createReadableContainerSas({
    containerName: "global",
  });
  return (
    <OrganizationProvider
      sasToken={orgSasToken}
      organization={organization}
      organizationMember={organizationMember}
    >
      <DashboardLayout
        authSasToken={authSasToken}
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
