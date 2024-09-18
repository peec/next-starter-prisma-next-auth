import React from "react";
import RegisterForm from "@/components/forms/auth/register-form/RegisterForm";

export async function generateMetadata() {
  return {
    title: "Register",
  };
}

export default function ForgotPasswordPage() {
  return <RegisterForm />;
}
