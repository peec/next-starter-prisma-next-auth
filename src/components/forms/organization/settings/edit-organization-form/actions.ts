"use server";

import { prisma } from "@/lib/prisma";
import { editOrganizationFormSchema } from "@/components/forms/organization/settings/edit-organization-form/form";
import { securedOrganizationAction } from "@/lib/action-utils";
import { OrganizationMemberRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export const editOrganizationSettings = securedOrganizationAction(
  editOrganizationFormSchema,
  async (data, { organization }) => {
    const t = await getTranslations("forms.edit-organization-form");
    try {
      await prisma.organization.update({
        data: {
          name: data.name,
        },
        where: {
          id: organization.id,
        },
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
