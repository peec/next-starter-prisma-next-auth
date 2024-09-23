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
import React, { useState, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import {
  ForgotPasswordFormDataInputs,
  ForgotPasswordFormDataSchema,
} from "@/components/forms/auth/forgot-password-form/schema";
import { handleForgotPasswordAction } from "@/components/forms/auth/forgot-password-form/actions";
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function ForgotPasswordForm({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const t = useTranslations("forms.forgot-password-form");
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const [disabled, setDisabled] = useState(false);
  useI18nZodErrors();
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
          title: t("emailSentToast.title"),
          description: t("emailSentToast.description"),
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
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-balance text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="grid gap-4 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("emailLabel")}</FormLabel>
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
            {t("resetPasswordButton")}
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
