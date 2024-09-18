"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { handleResetPasswordAction } from "@/components/forms/auth/password-reset-form/actions";
import {
  PasswordResetFormDataInputs,
  PasswordResetFormSchema,
} from "@/components/forms/auth/password-reset-form/schema";

export default function PasswordResetForm({ token }: { token: string }) {
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<PasswordResetFormDataInputs>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const processForm: SubmitHandler<PasswordResetFormDataInputs> = async (
    data,
  ) => {
    startTransaction(async () => {
      const res = await handleResetPasswordAction(token, data);
      if (res.success) {
        router.push(`/login`);
        toast({
          title: "Success",
          description: "Password reset success, login using your new password",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Reset password</h1>
          <p className="text-balance text-muted-foreground">
            Reset your password
          </p>
        </div>
        <div className="grid gap-4 mt-4">
          <FormField
            control={form.control}
            name="password"
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
            name="confirm_password"
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
          <Button type="submit" className="w-full" disabled={pending}>
            Reset password
            {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
