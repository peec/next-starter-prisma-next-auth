import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authenticated } from "@/auth";
import SetPasswordForm from "@/components/forms/account/set-password-form/SetPasswordForm";

export default async function AccountSettings() {
  const { user, hasPassword } = await authenticated();

  return (
    <div className="w-full max-w-lg">
      <div>
        <CardTitle className="text-3xl font-bold">Change password</CardTitle>
        <CardDescription>
          Change or set a password for your account.
        </CardDescription>

        <SetPasswordForm hasPassword={hasPassword} />
      </div>
    </div>
  );
}
