import React from "react";
import ForgotPasswordForm from "@/components/forms/auth/forgot-password-form/ForgotPasswordForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("pages.forgot-password");
  return {
    title: t("title"),
  };
}
export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: { callbackUrl: string | undefined };
}) {
  const callbackUrl = searchParams?.callbackUrl || "/dashboard";
  return <ForgotPasswordForm callbackUrl={callbackUrl} />;
}
