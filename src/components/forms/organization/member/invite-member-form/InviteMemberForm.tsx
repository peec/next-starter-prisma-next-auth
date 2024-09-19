"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { inviteMemberFormSchema } from "@/components/forms/organization/member/invite-member-form/form";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { inviteMember } from "@/components/forms/organization/member/invite-member-form/actions";

export default function InviteMemberForm({
  organization,
}: {
  organization: Organization;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });
  async function onSubmit(values: z.infer<typeof inviteMemberFormSchema>) {
    const result = await inviteMember(organization.id, values);
    if (result.success) {
      router.refresh();
      form.reset();
      toast({
        title: "Member invited",
        description: "Member invited to the team, an email has been sent.",
      });
    } else {
      toast({
        variant: "destructive",
        description: result.error,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="user@mail.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the e-mail of the person to invite.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Slect a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  OWNER role has full access, MEMBER role can not administrate
                  members.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Invite User</Button>
        </div>
      </form>
    </Form>
  );
}
