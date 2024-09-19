import { authenticated } from "@/auth";
import SetPasswordForm from "@/components/forms/account/set-password-form/SetPasswordForm";
import PageTitle from "@/components/layout/PageTitle";

export default async function AccountSettings() {
  const { hasPassword } = await authenticated();

  return (
    <div className="w-full max-w-lg">
      <div>
        <PageTitle
          title="Change password"
          description="Change or set a password for your account."
        />

        <SetPasswordForm hasPassword={hasPassword} />
      </div>
    </div>
  );
}
