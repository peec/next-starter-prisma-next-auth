"use client";

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
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function PasswordResetForm({ token }: { token: string }) {
  const t = useTranslations("forms.password-reset-form");
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  useI18nZodErrors();
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
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("toast.error.title"),
          description: res.error,
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
            {t("resetButton")}
            {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
