"use server";

import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";
import { inviteMemberFormSchema } from "@/components/forms/organization/member/invite-member-form/form";
import { securedOrganizationAction } from "@/lib/action-utils";
import { prisma } from "@/lib/prisma";
import { OrganizationMemberRole } from "@prisma/client";

export const inviteMember = securedOrganizationAction(
  inviteMemberFormSchema,
  async (data, { organization }) => {
    try {
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
  },
  {
    requiredRoles: [OrganizationMemberRole.OWNER],
  },
);
