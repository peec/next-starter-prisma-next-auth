"use server";

import { prisma } from "@/lib/prisma";
import { Organization, OrganizationMemberRole } from "@prisma/client";
import slugify from "slugify";
import { addOrganizaitonSchema } from "@/components/forms/add-organization-form/form";
import { securedAction } from "@/lib/action-utils";
import { getTranslations } from "next-intl/server";

export const addOrganization = securedAction<
  typeof addOrganizaitonSchema,
  {
    organization: Organization;
    success: true;
  }
>(addOrganizaitonSchema, async function (data, { user }) {
  const t = await getTranslations("forms.add-organization-form");
  try {
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
      error: t("errors.unknown_error"),
    };
  }
});
