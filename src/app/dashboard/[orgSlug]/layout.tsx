import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { authorizedOrganization } from "@/auth";

export default async function RootLayout({
  params: { orgSlug },
  children,
}: Readonly<{
  params: { orgSlug: string };
  children: React.ReactNode;
}>) {
  const { organization, user, organizationMember } =
    await authorizedOrganization(orgSlug);
  return (
    <DashboardLayout
      organizationMember={organizationMember}
      user={user}
      organization={organization}
    >
      {children}
    </DashboardLayout>
  );
}
