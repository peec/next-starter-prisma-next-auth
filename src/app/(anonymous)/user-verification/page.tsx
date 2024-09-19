import React from "react";

import UserVerificationForm from "@/components/forms/auth/user-verification-form/UserVerificationForm";

export async function generateMetadata() {
  return {
    title: "User verification",
  };
}

export default async function UserVerificationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const token = searchParams?.token || "";
  return <UserVerificationForm token={token} />;
}
