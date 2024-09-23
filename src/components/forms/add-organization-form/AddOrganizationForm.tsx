"use client";

import {
  Form,
  FormControl,
  FormDescription,
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
import { addOrganizaitonSchema } from "@/components/forms/add-organization-form/form";
import { addOrganization } from "@/components/forms/add-organization-form/actions";
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function AddOrganizationForm() {
  const t = useTranslations("forms.add-organization-form");
  const { toast } = useToast();
  const router = useRouter();
  useI18nZodErrors();
  const form = useForm<z.infer<typeof addOrganizaitonSchema>>({
    resolver: zodResolver(addOrganizaitonSchema),
    defaultValues: {
      name: "",
    },
  });
  async function onSubmit(values: z.infer<typeof addOrganizaitonSchema>) {
    const result = await addOrganization(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${result.organization.slug}`);
      toast({
        title: t("successToast.title"),
        description: (
          <p>
            {t("successToast.description", { name: result.organization.name })}
          </p>
        ),
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
                <FormLabel>{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("namePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("nameDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("submitButton")}</Button>
        </div>
      </form>
    </Form>
  );
}
