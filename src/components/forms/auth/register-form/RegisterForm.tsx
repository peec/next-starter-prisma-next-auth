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
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  RegisterFormDataInputs,
  RegisterFormDataSchema,
} from "@/components/forms/auth/register-form/schema";
import { handleRegisterAction } from "@/components/forms/auth/register-form/actions";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<RegisterFormDataInputs>({
    resolver: zodResolver(RegisterFormDataSchema),
    defaultValues: { name: "", email: "", password: "", confirm_password: "" },
  });

  const processForm: SubmitHandler<RegisterFormDataInputs> = async (data) => {
    startTransaction(async () => {
      const res = await handleRegisterAction(data);
      if (res.success) {
        router.push(`/login?callbackUrl=${callbackUrl}`);
        toast({
          title: "Verification e-mail sent",
          description:
            "In order to login, go to your email and verify your account.",
        });
      } else {
        if (res.errorCode === "account_exist") {
          form.setError("email", {
            type: "manual",
            message: res.error,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.error,
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-balance text-muted-foreground">
            Get started for free
          </p>
        </div>
        <div className="grid gap-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your full name</FormLabel>
                <FormControl>
                  <Input autoFocus type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input autoFocus type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
            Register
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
