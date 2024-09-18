"use server";

import {
  InviteHandler,
  RemoveMemberHandler,
  RevokeHandler,
} from "@/components/forms/organization/member/invite-member-form/form";
import { prisma } from "@/lib/prisma";
import { authorizedOrganization } from "@/auth";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";

export const inviteMember: InviteHandler = async (organization, data) => {
  try {
    await authorizedOrganization(organization.slug, ["OWNER"]);
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
