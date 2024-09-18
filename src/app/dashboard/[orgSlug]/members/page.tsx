import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import InviteMemberForm from "@/components/forms/organization/member/invite-member-form/InviteMemberForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
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
        },
      },
      organization: {
        select: {
          slug: true,
        },
      },
    },
  });

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organization,
    },
    include: {
      organization: {
        select: {
          slug: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <div className="flex justify-between items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Invite member
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to invite a new user to your
                    organization.
                  </DialogDescription>
                </DialogHeader>
                <InviteMemberForm organization={organization} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage existing users and invite new ones to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembersList members={members} invites={invites} />
        </CardContent>
      </Card>
    </div>
  );
}
