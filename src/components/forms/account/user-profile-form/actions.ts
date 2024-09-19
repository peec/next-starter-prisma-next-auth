"use server";

import { prisma } from "@/lib/prisma";
import { securedAction } from "@/lib/action-utils";
import { updateProfileFormSchema } from "@/components/forms/account/user-profile-form/form";

export const updateProfile = securedAction(
  updateProfileFormSchema,
  async function (data, { user }) {
    try {
      await prisma.user.update({
        data: {
          name: data.name,
        },
        where: {
          id: user.id,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Error while updating profile",
      };
    }
  },
);
