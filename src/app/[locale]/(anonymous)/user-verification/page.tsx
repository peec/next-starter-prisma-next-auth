import React from "react";

import UserVerificationForm from "@/components/forms/auth/user-verification-form/UserVerificationForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("pages.user-verification");
  return {
    title: t("title"),
  };
}

export default async function UserVerificationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const token = searchParams?.token || "";
  const callbackUrl = searchParams?.callbackUrl || "/dashboard";
  return <UserVerificationForm callbackUrl={callbackUrl} token={token} />;
}
