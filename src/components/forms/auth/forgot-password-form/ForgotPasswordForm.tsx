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
import React, { useState, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import {
  ForgotPasswordFormDataInputs,
  ForgotPasswordFormDataSchema,
} from "@/components/forms/auth/forgot-password-form/schema";
import { handleForgotPasswordAction } from "@/components/forms/auth/forgot-password-form/actions";

export default function ForgotPasswordForm({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const [disabled, setDisabled] = useState(false);
  const form = useForm<ForgotPasswordFormDataInputs>({
    resolver: zodResolver(ForgotPasswordFormDataSchema),
    defaultValues: { email: "" },
  });

  const processForm: SubmitHandler<ForgotPasswordFormDataInputs> = async (
    data,
  ) => {
    if (disabled) return;
    startTransaction(async () => {
      const res = await handleForgotPasswordAction(data);
      if (res.success) {
        setDisabled(true);
        toast({
          title: "E-mail sent",
          description: "Open your email and follow the instructions",
        });
      } else {
        form.setError("email", {
          type: "manual",
          message: res.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Forgot password</h1>
          <p className="text-balance text-muted-foreground">
            We will send you an e-mail with instructions
          </p>
        </div>
        <div className="grid gap-4 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={pending || disabled}
            type="submit"
            className="w-full"
          >
            Reset password
            {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link
            href={`/login?callbackUrl=${callbackUrl}`}
            className="underline"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
