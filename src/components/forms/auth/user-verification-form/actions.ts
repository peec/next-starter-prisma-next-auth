"use server";

import { prisma } from "@/lib/prisma";
import { isPasswordResetTokenExpired } from "@/lib/db";
import { hash } from "bcryptjs";
import {
  PasswordResetFormDataInputs,
  PasswordResetFormSchema,
} from "@/components/forms/auth/password-reset-form/schema";
import { generateResetToken } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import { WelcomeRegistration } from "@/email/auth/WelcomeRegistation";

export async function verifyAccount(token: string) {
  const verificationToken = await prisma.userVerificationToken.findFirst({
    where: {
      token,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  if (!verificationToken) {
    return {
      success: false,
      error: "Verification token does not exist, already verified?",
      errorCode: "token_does_not_exist",
    } as const;
  }

  if (isPasswordResetTokenExpired(verificationToken)) {
    return {
      success: false,
      error: "Verification token expired",
      errorCode: "token_expired",
      email: verificationToken.user.email,
    } as const;
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: {
          emailVerified: new Date(),
        },
        where: {
          id: verificationToken.userId,
        },
      });
      await tx.userVerificationToken.delete({
        where: { id: verificationToken.id },
      });
    });
  } catch (error) {
    console.error(error);
    return {
      succes: false,
      error: "Server error",
    } as const;
  }

  return {
    success: true,
  };
}

export async function resendVerificationToken(email: string) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return {
      success: false,
      error: "User does not exit",
    };
  }
  if (user.password === null) {
    return {
      success: false,
      error: "User has no credentails",
    };
  }
  if (user.emailVerified) {
    return {
      success: false,
      error: "User is already verified",
    };
  }

  const verifiedToken = await prisma.userVerificationToken.findFirst({
    where: { userId: user.id },
  });
  try {
    await prisma.$transaction(async (tx) => {
      if (verifiedToken) {
        await tx.userVerificationToken.delete({ where: { userId: user.id } });
      }
      const verificationToken = await generateResetToken();
      const now = new Date();
      const expiresAt = now.setTime(now.getTime() + 3600 * 24 * 3 * 1000);
      await tx.userVerificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt: new Date(expiresAt),
        },
      });
      await sendEmail({
        to: user.email,
        subject: `Verify your account on ${APP_NAME}`,
        body: WelcomeRegistration({
          name: user.name || user.email,
          verificationToken: verificationToken,
        }),
      });
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Server error",
    };
  }
  return {
    success: true,
  };
}
