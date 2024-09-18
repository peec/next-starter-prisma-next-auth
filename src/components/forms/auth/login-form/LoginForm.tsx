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
import { useRouter } from "next/navigation";
import {
  LoginFormDataInputs,
  LoginFormDataSchema,
} from "@/components/forms/auth/login-form/schema";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransaction] = useTransition();
  const form = useForm<LoginFormDataInputs>({
    resolver: zodResolver(LoginFormDataSchema),
    defaultValues: { email: "", password: "" },
  });
  const providers = Object.values(providerMap);

  const processForm: SubmitHandler<LoginFormDataInputs> = async (data) => {
    startTransaction(async () => {
      try {
        const result = await signIn("credentials", {
          ...data,
          callbackUrl: "/dashboard",
          redirect: false,
        });
        if (result?.error) {
          form.setError("password", {
            type: "server",
            message: "Invalid credentails",
          });
        } else {
          router.replace("/dashboard");
        }
      } catch (error) {
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
                    href="/forgot-password"
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
                      callbackUrl: "/dashboard",
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
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
