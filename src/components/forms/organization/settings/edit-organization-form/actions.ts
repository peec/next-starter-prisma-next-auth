"use server";

import { prisma } from "@/lib/prisma";
import { authorizedOrganization } from "@/auth";
import z from "zod";
import { editOrganizationFormSchema } from "@/components/forms/organization/settings/edit-organization-form/form";

export const editOrganizationSettings = async (
  organizationId: string,
  values: z.infer<typeof editOrganizationFormSchema> | unknown,
) => {
  const inputRequest = editOrganizationFormSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: "Validation error",
    };
  }
  const data = inputRequest.data;
  try {
    await authorizedOrganization({ id: organizationId }, ["OWNER"]);
    await prisma.organization.update({
      data: {
        name: data.name,
      },
      where: {
        id: organizationId,
      },
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
