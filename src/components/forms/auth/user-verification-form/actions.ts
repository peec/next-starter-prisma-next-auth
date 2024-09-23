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
import { getTranslations } from "next-intl/server";

export async function verifyAccount(token: string) {
  const t = await getTranslations("forms.user-verification-form");
  const verificationToken = await prisma.userVerificationToken.findFirst({
    where: {
      token,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
  if (!verificationToken) {
    return {
      success: false,
      error: t("errors.token_does_not_exist"),
      errorCode: "token_does_not_exist",
    } as const;
  }

  if (isPasswordResetTokenExpired(verificationToken)) {
    return {
      success: false,
      error: t("errors.token_expired"),
      errorCode: "token_expired",
      email: verificationToken.user.email,
    } as const;
  }

  try {
    const pendingSeenInvites = await prisma.organizationInvite.findMany({
      where: { email: verificationToken.user.email, seenOnce: true },
    });
    await prisma.$transaction(async (tx) => {
      // When account is verified, if user has already visited invite link from email, we auto add them.
      for (const pendingInvite of pendingSeenInvites) {
        await tx.organizationInvite.delete({
          where: {
            id: pendingInvite.id,
          },
        });
        await tx.organizationMember.create({
          data: {
            orgId: pendingInvite.orgId,
            userId: verificationToken.user.id,
            role: pendingInvite.role,
          },
        });
      }

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
      errorCode: "unknown_error",
      error: t("errors.unknown_error"),
    } as const;
  }

  return {
    success: true,
  };
}

export async function resendVerificationToken(email: string) {
  const t = await getTranslations("actions.resendVerificationToken");
  const tWelcomeEmail = await getTranslations("emails.welcome-registration");
  const user = await prisma.user.findFirst({ where: { email } });
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
      errorCode: "no_password",
      error: t("errors.no_password"),
    };
  }
  if (user.emailVerified) {
    return {
      success: false,
      errorCode: "email_not_verified",
      error: t("errors.email_not_verified"),
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
        subject: tWelcomeEmail("subject", { appName: APP_NAME }),
        body: await WelcomeRegistration({
          name: user.name || user.email,
          verificationToken: verificationToken,
        }),
      });
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: t("errors.unknown_error"),
    };
  }
  return {
    success: true,
  };
}
