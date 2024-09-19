"use client";

import {
  Form,
  FormControl,
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
import { updateProfileFormSchema } from "@/components/forms/account/user-profile-form/form";
import { updateProfile } from "@/components/forms/account/user-profile-form/actions";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";

export default function UpdateProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: user.name || "",
    },
  });
  async function onSubmit(values: z.infer<typeof updateProfileFormSchema>) {
    const result = await updateProfile(values);
    if (result.success) {
      router.refresh();
      toast({
        title: "Profile updated",
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
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="My name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={user.email} disabled />
          <p className="text-sm text-muted-foreground">
            Your email cannot be changed
          </p>
          <div>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
