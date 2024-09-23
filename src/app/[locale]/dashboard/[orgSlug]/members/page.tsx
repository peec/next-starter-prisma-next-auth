import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import InviteMemberForm from "@/components/forms/organization/member/invite-member-form/InviteMemberForm";

import MembersList from "@/components/organization/members/members-list/MembersList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageTitle from "@/components/layout/PageTitle";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const t = await getTranslations("pages.dashboard/members");
  const { organization } = await authorizedOrganization(orgSlug, [
    OrganizationMemberRole.OWNER,
  ]);

  const members = await prisma.organizationMember.findMany({
    where: {
      organization,
    },
    include: {
      user: {
        select: {
          email: true,
          image: true,
          name: true,
        },
      },
    },
  });

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organization,
    },
  });

  return (
    <div>
      <PageTitle title={t("title")} description={t("description")} />
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <div className="flex justify-between items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t("buttons.inviteMember")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("inviteDialog.title")}</DialogTitle>
                  <DialogDescription>
                    {t("inviteDialog.description")}
                  </DialogDescription>
                </DialogHeader>
                <InviteMemberForm organization={organization} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <MembersList members={members} invites={invites} />
    </div>
  );
}
