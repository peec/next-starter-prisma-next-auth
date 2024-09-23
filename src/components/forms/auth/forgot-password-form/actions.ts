"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import ResetPassword from "@/email/auth/ResetPassword";
import {
  ForgotPasswordFormDataInputs,
  ForgotPasswordFormDataSchema,
} from "@/components/forms/auth/forgot-password-form/schema";
import { isPasswordResetTokenExpired } from "@/lib/db";
import { generateResetToken } from "@/lib/crypto";
import { getTranslations } from "next-intl/server";

export async function handleForgotPasswordAction(
  values: ForgotPasswordFormDataInputs | unknown,
) {
  const t = await getTranslations("forms.forgot-password-form");
  const tEmail = await getTranslations("emails.reset-password");
  const inputRequest = ForgotPasswordFormDataSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: inputRequest.error.message,
    };
  }

  const input = inputRequest.data;

  const user = await prisma.user.findFirst({ where: { email: input.email } });
  if (!user) {
    return {
      success: false,
      errorCode: "account_not_found",
      error: t("errors.account_not_found"),
    };
  }
  if (user.password === null) {
    return {
      success: false,
      errorCode: "account_has_no_password",
      error: t("errors.account_has_no_password"),
    };
  }

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (existingToken) {
    if (!isPasswordResetTokenExpired(existingToken)) {
      try {
        await sendEmail({
          to: input.email,
          subject: tEmail("subject", { appName: APP_NAME }),
          body: await ResetPassword({
            token: existingToken,
            name: user.name || user.email,
          }),
        });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          errorCode: "unknown_error",
          error: t("errors.unknown_error"),
        };
      }
      return {
        success: true,
      };
    }
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const resetToken = await generateResetToken();
  const now = new Date();
  const expiresAt = now.setHours(now.getHours() + 12);

  try {
    await prisma.$transaction(async (tx) => {
      const token = await tx.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt: new Date(expiresAt),
        },
      });
      await sendEmail({
        to: input.email,
        subject: tEmail("subject", { appName: APP_NAME }),
        body: await ResetPassword({ token, name: user.name || user.email }),
      });
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorCode: "unknown_error",
      error: t("errors.unknown_error"),
    };
  }

  return {
    success: true,
  };
}
