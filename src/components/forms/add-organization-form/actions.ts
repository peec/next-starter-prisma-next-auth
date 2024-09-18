"use server";

import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Organization, OrganizationMemberRole } from "@prisma/client";
import slugify from "slugify";
import { addOrganizaitonSchema } from "@/components/forms/add-organization-form/form";
import z from "zod";

export async function addOrganization(
  data: z.infer<typeof addOrganizaitonSchema>,
): Promise<
  | { success: true; organization: Organization }
  | { success: false; error: string }
> {
  try {
    const { user } = await authenticated();
    const inputRequest = addOrganizaitonSchema.safeParse(data);
    if (!inputRequest.success) {
      return {
        success: false,
        error: "Validation error",
      };
    }

    const slugged = slugify(data.name.substring(0, 50), {
      lower: true,
    });
    const slugCount = await prisma.organization.count({
      where: { slug: { startsWith: slugged } },
    });
    const orgSlug = `${slugged}${slugCount === 0 ? "" : `-${slugCount + 1}`}`;

    const organization = await prisma.organization.create({
      data: { name: data.name, slug: orgSlug, ownerId: user.id },
    });
    await prisma.organizationMember.create({
      data: {
        orgId: organization.id,
        userId: user.id,
        role: OrganizationMemberRole.OWNER,
      },
    });
    return {
      success: true,
      organization,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Could not create organization",
    };
  }
}
