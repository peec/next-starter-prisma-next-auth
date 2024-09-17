import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import UserManager from "@/components/organization/members/UserManager";
import { inviteMember } from "@/app/dashboard/[orgSlug]/members/actions";

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const { organization } = await authorizedOrganization(
    orgSlug,
    OrganizationMemberRole.OWNER,
  );

  const members = await prisma.organizationMember.findMany({
    where: {
      organization,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organization,
    },
  });

  return (
    <UserManager
      members={members}
      inviteMember={inviteMember}
      organization={organization}
    />
  );
}
