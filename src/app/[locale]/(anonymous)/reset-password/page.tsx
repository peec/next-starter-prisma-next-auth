import React from "react";
import PasswordResetForm from "@/components/forms/auth/password-reset-form/PasswordResetForm";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("pages.reset-password");
  return {
    title: t("title"),
  };
}
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const token = searchParams?.token;
  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          <p className="mb-4">Invalid token</p>
          <Link href="/forgot-password">
            <Button size="sm" variant="secondary">
              Reset again
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
    },
  });
  if (!passwordResetToken) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          <p className="mb-4">
            Could not validate token, or it might be expired.
          </p>
          <Link href="/forgot-password">
            <Button size="sm" variant="secondary">
              Reset again
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return <PasswordResetForm token={passwordResetToken.token} />;
}
