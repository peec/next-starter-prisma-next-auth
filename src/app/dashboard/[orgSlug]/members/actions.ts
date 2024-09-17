"use server";

import { InviteHandler } from "@/components/organization/members/form";
import { prisma } from "@/lib/prisma";
import { authorizedOrganization } from "@/auth";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import OrganizationInvitation from "@/email/members/OrganizationInvitation";

export const inviteMember: InviteHandler = async (organization, data) => {
  try {
    await authorizedOrganization(organization.slug);

    const invitation = await prisma.organizationInvite.create({
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
