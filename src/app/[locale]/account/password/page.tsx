import { authenticated } from "@/auth";
import SetPasswordForm from "@/components/forms/account/set-password-form/SetPasswordForm";
import PageTitle from "@/components/layout/PageTitle";
import { getTranslations } from "next-intl/server";

export default async function AccountSettings() {
  const t = await getTranslations("pages.account/password");
  const { hasPassword } = await authenticated();

  return (
    <div className="w-full max-w-lg">
      <div>
        <PageTitle title={t("title")} description={t("description")} />

        <SetPasswordForm hasPassword={hasPassword} />
      </div>
    </div>
  );
}
