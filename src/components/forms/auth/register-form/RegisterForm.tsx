"use client";

import { Link } from "@/i18n/routing";
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
import {
  RegisterFormDataInputs,
  RegisterFormDataSchema,
} from "@/components/forms/auth/register-form/schema";
import { handleRegisterAction } from "@/components/forms/auth/register-form/actions";
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const t = useTranslations("forms.register-form");
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  useI18nZodErrors();
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
          title: t("toast.verificationEmailSent.title"),
          description: t("toast.verificationEmailSent.description"),
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
            title: t("toast.error.title"),
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
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-balance text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="grid gap-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nameLabel")}</FormLabel>
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
                <FormLabel>{t("emailLabel")}</FormLabel>
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
                <FormLabel>{t("passwordLabel")}</FormLabel>
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
                <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {t("registerButton")}
            {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          {t("loginText")}{" "}
          <Link
            href={`/login?callbackUrl=${callbackUrl}`}
            className="underline"
          >
            {t("loginLink")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
