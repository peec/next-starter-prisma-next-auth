"use server";

import { prisma } from "@/lib/prisma";
import { securedAction } from "@/lib/action-utils";
import { setPasswordFormSchema } from "@/components/forms/account/set-password-form/form";
import { compare, hash } from "bcryptjs";
import { getTranslations } from "next-intl/server";

export const updatePassword = securedAction(
  setPasswordFormSchema,
  async function (data, { user }) {
    const t = await getTranslations("forms.set-password-form");
    try {
      const userWithPassword = await prisma.user.findFirstOrThrow({
        where: { id: user.id },
      });

      // If user has existing password, they must type their old to change it.
      if (
        userWithPassword.password !== null &&
        !(await compare(
          String(data.currentPassword),
          userWithPassword.password,
        ))
      ) {
        return {
          success: false,
          error: t("errors.wrong_password"),
        };
      }

      const password = await hash(data.newPassword, 12);
      await prisma.user.update({
        data: {
          password,
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
        error: t("errors.unknown_error"),
      };
    }
  },
);
