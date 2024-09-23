import LoginForm from "@/components/forms/auth/login-form/LoginForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("pages.login");
  return {
    title: t("title"),
  };
}
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl: string | undefined };
}) {
  const callbackUrl = searchParams?.callbackUrl || "/dashboard";
  return <LoginForm callbackUrl={callbackUrl} />;
}
