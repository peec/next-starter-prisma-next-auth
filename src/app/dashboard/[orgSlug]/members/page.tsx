import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import UserManager from "@/components/organization/members/UserManager";
import {
  inviteMember,
  removeMember,
  revokeInvitation,
} from "@/app/dashboard/[orgSlug]/members/actions";

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const { organization } = await authorizedOrganization(orgSlug, [
    OrganizationMemberRole.OWNER,
  ]);

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
      organization: {
        select: {
          slug: true,
        },
      },
    },
  });

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organization,
    },
    include: {
      organization: {
        select: {
          slug: true,
        },
      },
    },
  });

  return (
    <UserManager
      members={members}
      invites={invites}
      inviteMember={inviteMember}
      organization={organization}
      revokeInvitation={revokeInvitation}
      removeMember={removeMember}
    />
  );
}
