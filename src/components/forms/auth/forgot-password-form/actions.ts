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

export async function handleForgotPasswordAction(
  data: ForgotPasswordFormDataInputs,
) {
  const inputRequest = ForgotPasswordFormDataSchema.safeParse(data);
  if (!inputRequest.success) {
    return {
      success: false,
      error: "Validation error",
    };
  }

  const input = inputRequest.data;

  const user = await prisma.user.findFirst({ where: { email: input.email } });
  if (!user) {
    return {
      success: false,
      error: "Account not found",
    };
  }
  if (user.password === null) {
    return {
      success: false,
      error:
        "Account does not have password, please login with the provider you used for this email.",
    };
  }

  async function generateResetToken(length = 32) {
    const { randomBytes } = await import("node:crypto");
    return randomBytes(length).toString("hex");
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
          to: data.email,
          subject: `Password reset request on ${APP_NAME}`,
          body: ResetPassword({
            token: existingToken,
            name: user.name || user.email,
          }),
        });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "Could not reset password, please try again",
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
        to: data.email,
        subject: `Password reset request on ${APP_NAME}`,
        body: ResetPassword({ token, name: user.name || user.email }),
      });
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Could not reset password, please try again",
    };
  }

  return {
    success: true,
  };
}
