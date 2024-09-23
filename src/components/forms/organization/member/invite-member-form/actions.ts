"use server";

import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";
import { inviteMemberFormSchema } from "@/components/forms/organization/member/invite-member-form/form";
import { securedOrganizationAction } from "@/lib/action-utils";
import { prisma } from "@/lib/prisma";
import { OrganizationMemberRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export const inviteMember = securedOrganizationAction(
  inviteMemberFormSchema,
  async (data, { organization }) => {
    const t = await getTranslations("forms.invite-member-form");
    const tEmail = await getTranslations("emails.organization-invitation");
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
          subject: tEmail("subject", {
            appName: APP_NAME,
            organizationName: organization.name,
          }),
          body: await OrganizationInvitation({ organization, invitation }),
        });
      });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: t("errors.unknown_error"),
      };
    }
  },
  {
    requiredRoles: [OrganizationMemberRole.OWNER],
  },
);
