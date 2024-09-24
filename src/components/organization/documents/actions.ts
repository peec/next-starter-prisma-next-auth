"use server";

import { securedOrganizationAction } from "@/lib/action-utils";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { OrganizationMemberRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export const removeDocument = securedOrganizationAction(
  z.object({
    id: z.string(),
  }),
  async (data, { organization }) => {
    const t = await getTranslations("components.documents-list");
    try {
      const document = await prisma.organizationDocument.findFirst({
        where: {
          orgId: organization.id,
          id: data.id,
        },
      });
      if (!document) {
        return {
          success: false,
          error: t("errors.document_not_found"),
        };
      }

      await prisma.organizationDocument.delete({
        where: {
          id: document.id,
          orgId: organization.id,
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
