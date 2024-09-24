"use client";

import { Button } from "@/components/ui/button";
import {
  OrganizationInvite,
  OrganizationMember,
  OrganizationMemberRole,
} from "@prisma/client";
import {
  changeRole,
  removeMember,
  revokeInvitation,
} from "@/components/organization/members/members-list/actions";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/use-organization";
import { useConfirm } from "@/hooks/alert";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { TrashIcon } from "lucide-react";
import { imageUrlFor } from "@/lib/uploader/url";

export default function MembersList({
  members,
  invites,
}: {
  members: (OrganizationMember & {
    user: { email: string; image: string | null; name: string | null };
  })[];
  invites: OrganizationInvite[];
}) {
  const tRole = useTranslations("organizationRoles");
  const t = useTranslations("components.members-list");
  const confirm = useConfirm();
  const { organization } = useOrganization();
  const { user, sasToken: userSasToken } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const merged = [
    ...members.map((member) => ({
      email: member.user.email,
      name: member.user.name,
      avatarUrl: member.user.image,
      role: member.role,
      id: member.id,
      type: "member",
    })),
    ...invites.map((invite) => ({
      email: invite.email,
      name: null,
      avatarUrl: null,
      role: invite.role,
      id: invite.id,
      type: "invite",
    })),
  ];

  const roles = [OrganizationMemberRole.OWNER, OrganizationMemberRole.MEMBER];
  return (
    <>
      <div className="space-y-4">
        {merged.map((member) => (
          <div
            key={member.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                {member.avatarUrl && (
                  <AvatarImage
                    src={imageUrlFor(member.avatarUrl, userSasToken) || ""}
                    alt={member.email}
                  />
                )}
                <AvatarFallback>{member.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {member.name ||
                    (member.type === "invite" ? t("table.types.invite") : "")}
                </p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  disabled={
                    user.id ===
                      members.find((inv) => inv.id === member.id)?.userId ||
                    member.type === "invite"
                  }
                >
                  <Button variant="outline">
                    {tRole(member.role)}{" "}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {t("table.actions.change-role.label")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      disabled={member.role === role}
                      onClick={async () => {
                        const result = await changeRole(organization.id, {
                          id: member.id,
                          role,
                        });

                        if (result.success) {
                          toast({
                            variant: "default",
                            description: (
                              <p>
                                {t("table.actions.change-role.toast.success", {
                                  email: member.email,
                                })}
                              </p>
                            ),
                          });
                          router.refresh();
                        } else {
                          toast({
                            variant: "destructive",
                            description: result.error,
                          });
                        }
                      }}
                    >
                      {tRole(role)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {member.type === "invite" && (
                <Button
                  type="button"
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: t("table.actions.invite.confirm.title"),
                      body: t("table.actions.invite.confirm.body", {
                        email: member.email,
                      }),
                      cancelButton: t("table.actions.invite.confirm.cancel"),
                      actionButton: t("table.actions.invite.confirm.action"),
                      actionButtonVariant: "destructive",
                    });
                    if (!confirmed) {
                      return;
                    }
                    const result = await revokeInvitation(organization.id, {
                      id: member.id,
                    });
                    if (result.success) {
                      toast({
                        variant: "default",
                        description: (
                          <p>
                            {t("table.actions.invite.toast.success", {
                              email: member.email,
                            })}
                          </p>
                        ),
                      });
                      router.refresh();
                    } else {
                      toast({
                        variant: "destructive",
                        description: result.error,
                      });
                    }
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <TrashIcon className="h-4 w-4" />

                  <span className="sr-only">
                    {t("table.actions.invite.button.revoke")}
                  </span>
                </Button>
              )}
              {member.type === "member" && (
                <Button
                  type="button"
                  disabled={
                    user.id ===
                    members.find((inv) => inv.id === member.id)?.userId
                  }
                  onClick={async () => {
                    const result = await removeMember(organization.id, {
                      id: member.id,
                    });
                    if (result.success) {
                      toast({
                        variant: "default",
                        description: (
                          <p>
                            {t("table.actions.member.toast.success", {
                              email: member.email,
                            })}
                          </p>
                        ),
                      });
                      router.refresh();
                    } else {
                      toast({
                        variant: "destructive",
                        description: result.error,
                      });
                    }
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <TrashIcon className="h-4 w-4" />

                  <span className="sr-only">
                    {t("table.actions.member.button.remove")}
                  </span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
