"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addOrganizaitonSchema } from "@/components/forms/add-organization-form/form";
import { addOrganization } from "@/components/forms/add-organization-form/actions";

export default function AddOrganizationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof addOrganizaitonSchema>>({
    resolver: zodResolver(addOrganizaitonSchema),
    defaultValues: {
      name: "",
    },
  });
  async function onSubmit(values: z.infer<typeof addOrganizaitonSchema>) {
    const result = await addOrganization(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${result.organization.slug}`);
      toast({
        title: "Organization created",
        description: (
          <p>
            <strong>{result.organization.name}</strong> created successfully
          </p>
        ),
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc" {...field} />
                </FormControl>
                <FormDescription>Enter your organization name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Organization</Button>
        </div>
      </form>
    </Form>
  );
}
