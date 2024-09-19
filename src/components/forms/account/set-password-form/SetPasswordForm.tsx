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
import { setPasswordFormSchema } from "@/components/forms/account/set-password-form/form";
import { updatePassword } from "@/components/forms/account/set-password-form/actions";
import React from "react";
import { LockOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function SetPasswordForm({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      confirmNewPassword: "",
      newPassword: "",
      currentPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof setPasswordFormSchema>) {
    const result = await updatePassword(values);
    if (result.success) {
      toast({
        title: "Password updated",
        description:
          "Password was updated successfully. On next login use the new password.",
      });
      form.reset();
      router.refresh();
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
          {hasPassword && (
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!hasPassword && (
            <Alert>
              <LockOpen className="h-4 w-4" />
              <AlertTitle>Security warning</AlertTitle>
              <AlertDescription>
                Your account does not have any password set, you have logged in
                using a provider. Passwords are generally not recommended, but
                can be set if you want to use password based login.
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
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
