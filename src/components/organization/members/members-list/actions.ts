"use server";

import {
  RemoveMemberHandler,
  RevokeHandler,
} from "@/components/forms/organization/member/invite-member-form/form";
import { authorizedOrganization } from "@/auth";
import { prisma } from "@/lib/prisma";

export const revokeInvitation: RevokeHandler = async (invitation) => {
  try {
    await authorizedOrganization(invitation.organization.slug, ["OWNER"]);

    await prisma.organizationInvite.delete({
      where: {
        id: invitation.id,
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

export const removeMember: RemoveMemberHandler = async (member) => {
  try {
    const { user } = await authorizedOrganization(member.organization.slug, [
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
