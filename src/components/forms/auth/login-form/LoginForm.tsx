"use client";

import { signIn } from "next-auth/react";
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
import { providerMap } from "@/auth.config";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  LoginFormDataInputs,
  LoginFormDataSchema,
} from "@/components/forms/auth/login-form/schema";
import { useConfirm } from "@/hooks/alert";
import { resendVerificationToken } from "@/components/forms/auth/user-verification-form/actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [pending, startTransaction] = useTransition();
  const form = useForm<LoginFormDataInputs>({
    resolver: zodResolver(LoginFormDataSchema),
    defaultValues: { email: "", password: "" },
  });
  const providers = Object.values(providerMap);
  const confirm = useConfirm();

  const processForm: SubmitHandler<LoginFormDataInputs> = async (data) => {
    startTransaction(async () => {
      try {
        const result = await signIn("credentials", {
          ...data,
          redirect: false,
        });
        if (result?.error) {
          if (result.code === "not_verified") {
            form.setError("email", {
              type: "server",
              message:
                "Account not validated yet, go to your email and validate your account.",
            });
            const resend = await confirm({
              title: "Account not verified yet",
              body: "Your account is not verified yet, check your e-mail. If you have not received an email, check spam or try resending the verification email.",
              cancelButton: "Close",
              actionButton: "Resend verification e-mail",
            });
            if (resend) {
              await resendVerificationToken(data.email);
            }
          } else {
            form.setError("password", {
              type: "server",
              message: "Invalid credentails",
            });
          }
        } else {
          // do full reload
          window.location.href = callbackUrl;
        }
      } catch (error) {
        console.log(error);
        form.setError("password", {
          type: "server",
          message: "Invalid credentails",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Login to your account
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
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={`/forgot-password?callbackUrl=${callbackUrl}`}
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
            {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>

          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl,
                    })
                  }
                >
                  Logg inn med {provider.name}
                </Button>
              </div>
            ))}
        </div>
        <div className="mt-4 text-center text-sm">
          Dont have an account?{" "}
          <Link
            href={`/register?callbackUrl=${callbackUrl}`}
            className="underline"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
