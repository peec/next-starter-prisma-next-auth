"use server";

import { prisma } from "@/lib/prisma";
import { authorizedOrganization } from "@/auth";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";
import z from "zod";
import { inviteMemberFormSchema } from "@/components/forms/organization/member/invite-member-form/form";

export type InviteHandler = (
  organizationId: string,
  values: z.infer<typeof inviteMemberFormSchema> | unknown,
) => Promise<{ success: true } | { success: false; error: string }>;

export const inviteMember: InviteHandler = async (organizationId, values) => {
  const inputRequest = inviteMemberFormSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: "Validation error",
    };
  }
  const data = inputRequest.data;

  try {
    const { organization } = await authorizedOrganization(
      { id: organizationId },
      ["OWNER"],
    );
    if (
      await prisma.organizationMember.findFirst({
        where: {
          user: {
            email: data.email,
          },
          orgId: organizationId,
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
          orgId: organizationId,
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
