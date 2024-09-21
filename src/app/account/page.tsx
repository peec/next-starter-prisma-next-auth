import UpdateProfileForm from "@/components/forms/account/user-profile-form/UpdateProfileForm";
import { prisma } from "@/lib/prisma";
import { authenticated } from "@/auth";
import { UserCheck } from "lucide-react";
import { providerMap } from "@/auth.config";
import PageTitle from "@/components/layout/PageTitle";
import ProfilePictureUploader from "@/components/account/ProfilePictureUploader";

export default async function AccountSettings() {
  const { user } = await authenticated();

  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div>
      <PageTitle
        title="Account settings"
        description="Make changes to your profile here."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <ProfilePictureUploader />
        <div className="space-y-4">
          <div className="space-y-2">
            <UpdateProfileForm />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {accounts.length === 0 && (
            <div className="flex items-center p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">
                  No connected accounts
                </p>
              </div>
            </div>
          )}
          {accounts.map((account) => (
            <div
              key={`${account.provider}_${account.providerAccountId}`}
              className="flex items-center p-4 border rounded-lg"
            >
              <UserCheck className="h-6 w-6 mr-4" />
              <div>
                <p className="font-medium">
                  {providerMap.find((p) => p.id === account.provider)?.name}
                </p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
