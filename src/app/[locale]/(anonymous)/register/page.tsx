import React from "react";
import RegisterForm from "@/components/forms/auth/register-form/RegisterForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("pages.register");
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
  return <RegisterForm callbackUrl={callbackUrl} />;
}
