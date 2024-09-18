"use server";

import {
  InviteHandler,
  RemoveMemberHandler,
  RevokeHandler,
} from "@/components/organization/members/form";
import { prisma } from "@/lib/prisma";
import { authorizedOrganization } from "@/auth";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";

export const inviteMember: InviteHandler = async (organization, data) => {
  await authorizedOrganization(organization.slug);
  if (
    await prisma.organizationMember.findFirst({
      where: {
        user: {
          email: data.email,
        },
        orgId: organization.id,
      },
    })
  ) {
    return {
      success: false,
      error: `${data.email} is already a member of the organization.`,
    };
  }
  try {
    await prisma.$transaction(async (tx) => {
      const invitation = await tx.organizationInvite.create({
        data: {
          email: data.email,
          role: data.role,
          orgId: organization.id,
        },
      });
      await sendEmail({
        to: data.email,
        subject: `Invitation to ${organization.name} on ${APP_NAME}`,
        body: OrganizationInvitation({ organization, invitation }),
      });
    });
    console.log("success invite member");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error creating invitation",
    };
  }
};

export const revokeInvitation: RevokeHandler = async (invitation) => {
  try {
    await authorizedOrganization(invitation.organization.slug, "OWNER");

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
    const { user } = await authorizedOrganization(
      member.organization.slug,
      "OWNER",
    );

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
