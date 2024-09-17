"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Organization,
  OrganizationInvite,
  OrganizationMember,
} from "@prisma/client";
import {
  InviteHandler,
  RemoveMemberHandler,
  RevokeHandler,
} from "@/components/organization/members/form";
import InviteMemberForm from "@/components/organization/members/InviteMemberForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File, ListFilter, PlusCircle } from "lucide-react";

export default function UserManager({
  members,
  invites,
  inviteMember,
  organization,
  revokeInvitation,
  removeMember,
}: {
  members: (OrganizationMember & {
    organization: {
      slug: string;
    };
    user: { email: string };
  })[];
  inviteMember: InviteHandler;
  organization: Organization;
  invites: (OrganizationInvite & { organization: { slug: string } })[];
  revokeInvitation: RevokeHandler;
  removeMember: RemoveMemberHandler;
}) {
  const user = useUser();
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
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <InviteMemberForm
            inviteMember={inviteMember}
            organization={organization}
          />
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
                          const invite = invites.find(
                            (inv) => inv.id === member.id,
                          );
                          if (invite) {
                            const result = await revokeInvitation(invite);
                            if (result.success) {
                              toast({
                                variant: "default",
                                description: (
                                  <p>
                                    Invitation for{" "}
                                    <strong>{invite.email}</strong> revoked.
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
                          const memberEntity = members.find(
                            (inv) => inv.id === member.id,
                          );
                          if (memberEntity) {
                            const result = await removeMember(memberEntity);
                            if (result.success) {
                              toast({
                                variant: "default",
                                description: (
                                  <p>
                                    Removed member{" "}
                                    <strong>{member.email}</strong> from the
                                    organization.
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
        </CardContent>
      </Card>
    </div>
  );
}
