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
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function UpdateProfileForm() {
  const t = useTranslations("forms.update-profile-form");
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  useI18nZodErrors();
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
        title: t("toast.success.title"),
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
                <FormLabel>{t("form.fullName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.fullName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label htmlFor="email">{t("form.email.label")}</Label>
          <Input id="email" type="email" defaultValue={user.email} disabled />
          <p className="text-sm text-muted-foreground">
            {t("form.email.note")}
          </p>
          <div>
            <Button type="submit">{t("form.button.submit")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
