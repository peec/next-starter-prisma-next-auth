"use server";

import { prisma } from "@/lib/prisma";
import { isPasswordResetTokenExpired } from "@/lib/db";
import { hash } from "bcryptjs";
import {
  PasswordResetFormDataInputs,
  PasswordResetFormSchema,
} from "@/components/forms/auth/password-reset-form/schema";

export async function handleResetPasswordAction(
  token: string,
  values: PasswordResetFormDataInputs | unknown,
) {
  const inputRequest = PasswordResetFormSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: "Validation error",
    };
  }
  const input = inputRequest.data;

  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
    },
  });
  if (!passwordResetToken) {
    return {
      success: false,
      error: "Reset token does not exist",
    };
  }

  if (isPasswordResetTokenExpired(passwordResetToken)) {
    return {
      success: false,
      error: "Reset password token expired",
    };
  }

  const password = await hash(input.password, 12);

  await prisma.user.update({
    data: {
      password,
    },
    where: {
      id: passwordResetToken.userId,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: passwordResetToken.id },
  });

  return {
    success: true,
  };
}
