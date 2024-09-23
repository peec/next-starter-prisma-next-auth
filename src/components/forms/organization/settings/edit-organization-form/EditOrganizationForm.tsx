"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { editOrganizationFormSchema } from "@/components/forms/organization/settings/edit-organization-form/form";
import { editOrganizationSettings } from "@/components/forms/organization/settings/edit-organization-form/actions";
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function EditOrganizationForm({
  organization,
}: {
  organization: Organization;
}) {
  const t = useTranslations("forms.edit-organization-form");
  const { toast } = useToast();
  const router = useRouter();
  useI18nZodErrors();
  const form = useForm<z.infer<typeof editOrganizationFormSchema>>({
    resolver: zodResolver(editOrganizationFormSchema),
    values: {
      name: organization.name,
    },
  });
  async function onSubmit(values: z.infer<typeof editOrganizationFormSchema>) {
    const result = await editOrganizationSettings(organization.id, values);
    if (result.success) {
      router.refresh();
      toast({
        description: t("toastMessages.success.description"),
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("fields.name.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("fields.name.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">{t("buttons.submit")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
