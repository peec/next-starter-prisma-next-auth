"use server";

import { authorizedOrganization } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrganizationInvite, OrganizationMember } from "@prisma/client";

type RevokeHandler = (
  organizationId: string,
  invitation: OrganizationInvite & { organization: { slug: string } },
) => Promise<{ success: true } | { success: false; error: string }>;

export const revokeInvitation: RevokeHandler = async (
  organizationId,
  invitation,
) => {
  try {
    await authorizedOrganization({ id: organizationId }, ["OWNER"]);

    await prisma.organizationInvite.delete({
      where: {
        id: invitation.id,
        orgId: organizationId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error removing invitation",
    };
  }
};

type RemoveMemberHandler = (
  organizationId: string,
  member: OrganizationMember & { organization: { slug: string } },
) => Promise<{ success: true } | { success: false; error: string }>;

export const removeMember: RemoveMemberHandler = async (
  organizationid,
  member,
) => {
  try {
    const { user } = await authorizedOrganization({ id: organizationid }, [
      "OWNER",
    ]);

    if (user.id === member.userId) {
      return {
        success: false,
        error: "You can not remove your self from the organization.",
      };
    }

    await prisma.organizationMember.delete({
      where: {
        id: member.id,
        orgId: organizationid,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error removing invitation",
    };
  }
};
