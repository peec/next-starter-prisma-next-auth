"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import { WelcomeRegistration } from "@/email/auth/WelcomeRegistation";
import {
  RegisterFormDataInputs,
  RegisterFormDataSchema,
} from "@/components/forms/auth/register-form/schema";
import { generateResetToken } from "@/lib/crypto";

export async function handleRegisterAction(
  values: RegisterFormDataInputs | unknown,
) {
  const inputRequest = RegisterFormDataSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: inputRequest.error.message,
    };
  }
  const data = inputRequest.data;

  const existingUser = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (existingUser) {
    if (existingUser.emailVerified === null) {
      return {
        success: false,
        error: "Account is not verified.",
        errorCode: "missing_verification",
      };
    }
    return {
      success: false,
      error: "You already have an account registered to this email",
      errorCode: "account_exist",
    };
  }

  try {
    const password = await hash(data.password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password,
          name: data.name,
        },
      });
      const verificationToken = await generateResetToken();
      const now = new Date();
      const expiresAt = now.setTime(now.getTime() + 3600 * 24 * 3 * 1000);
      const token = await tx.userVerificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt: new Date(expiresAt),
        },
      });

      await sendEmail({
        to: data.email,
        subject: `Verify your account on ${APP_NAME}`,
        body: WelcomeRegistration({
          name: data.name,
          verificationToken: verificationToken,
        }),
      });
      return {
        user,
      };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Could not create account, please try again",
    };
  }

  return {
    success: true,
  };
}
