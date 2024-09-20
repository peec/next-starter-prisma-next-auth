import React from "react";
import RegisterForm from "@/components/forms/auth/register-form/RegisterForm";

export async function generateMetadata() {
  return {
    title: "Register",
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
