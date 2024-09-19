import { CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateProfileForm from "@/components/forms/account/user-profile-form/UpdateProfileForm";
import { prisma } from "@/lib/prisma";
import { authenticated } from "@/auth";
import { Pencil, UserCheck } from "lucide-react";
import { providerMap } from "@/auth.config";

export default async function AccountSettings() {
  const { user } = await authenticated();

  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="w-full">
      <CardTitle className="text-3xl font-bold">Account settings</CardTitle>
      <CardDescription>Make changes to your profile here.</CardDescription>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-40 w-40">
              <AvatarImage src={""} alt={user.name || ""} />
              <AvatarFallback className="text-4xl">
                {(user.name || "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer transition-colors"
            >
              <Pencil className="h-6 w-6" />
              <input
                id="avatar-upload"
                type="file"
                className="sr-only"
                accept="image/*"
              />
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the pencil to change your avatar @todo does not work yet. add
            backend logic for it.
          </p>
        </div>
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
