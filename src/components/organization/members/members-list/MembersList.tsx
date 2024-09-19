"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrganizationInvite, OrganizationMember } from "@prisma/client";
import {
  removeMember,
  revokeInvitation,
} from "@/components/organization/members/members-list/actions";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/use-organization";

export default function MembersList({
  members,
  invites,
}: {
  members: (OrganizationMember & {
    user: { email: string };
  })[];
  invites: OrganizationInvite[];
}) {
  const { organization } = useOrganization();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const merged = [
    ...members.map((member) => ({
      email: member.user.email,
      role: member.role,
      id: member.id,
      type: "member",
    })),
    ...invites.map((invite) => ({
      email: invite.email,
      role: invite.role,
      id: invite.id,
      type: "invite",
    })),
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merged.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              {member.type === "member" ? "Member" : "Invitation"}
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>
              {member.type === "invite" && (
                <Button
                  size="sm"
                  type="button"
                  onClick={async () => {
                    const result = await revokeInvitation(organization.id, {
                      id: member.id,
                    });
                    if (result.success) {
                      toast({
                        variant: "default",
                        description: (
                          <p>
                            Invitation for <strong>{member.email}</strong>{" "}
                            revoked.
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
                  variant="destructive"
                >
                  Revoke
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
                            Removed member <strong>{member.email}</strong> from
                            the organization.
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
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
