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
import { Organization, OrganizationMember } from "@prisma/client";
import { InviteHandler } from "@/components/organization/members/form";
import InviteMemberForm from "@/components/organization/members/InviteMemberForm";

export default function UserManager({
  members,
  inviteMember,
  organization,
}: {
  members: (OrganizationMember & { user: { email: string } })[];
  inviteMember: InviteHandler;
  organization: Organization;
}) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage existing users and invite new ones to your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InviteMemberForm
          inviteMember={inviteMember}
          organization={organization}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
