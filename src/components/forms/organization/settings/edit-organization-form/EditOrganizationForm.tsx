"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { editOrganizationFormSchema } from "@/components/forms/organization/settings/edit-organization-form/form";
import { editOrganizationSettings } from "@/components/forms/organization/settings/edit-organization-form/actions";

export default function EditOrganizationForm({
  organization,
}: {
  organization: Organization;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof editOrganizationFormSchema>>({
    resolver: zodResolver(editOrganizationFormSchema),
    values: {
      name: organization.name,
    },
  });
  async function onSubmit(values: z.infer<typeof editOrganizationFormSchema>) {
    const result = await editOrganizationSettings(organization.id, values);
    if (result.success) {
      router.refresh();
      toast({
        description: "Updated organization settings",
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc" {...field} />
                </FormControl>
                <FormDescription>Name of your organization</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
