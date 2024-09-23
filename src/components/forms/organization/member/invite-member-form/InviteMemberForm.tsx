"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { inviteMemberFormSchema } from "@/components/forms/organization/member/invite-member-form/form";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { inviteMember } from "@/components/forms/organization/member/invite-member-form/actions";
import { useTranslations } from "next-intl";
import { useI18nZodErrors } from "@/lib/zod/useI18nZodErrors";

export default function InviteMemberForm({
  organization,
}: {
  organization: Organization;
}) {
  const t = useTranslations("forms.invite-member-form");
  const { toast } = useToast();
  const router = useRouter();
  useI18nZodErrors();
  const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });
  async function onSubmit(values: z.infer<typeof inviteMemberFormSchema>) {
    const result = await inviteMember(organization.id, values);
    if (result.success) {
      router.refresh();
      form.reset();
      toast({
        title: t("successToast.title"),
        description: t("successToast.description"),
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("emailPlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("emailDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("roleLabel")}</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("roleSelectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">{t("roles.owner")}</SelectItem>
                      <SelectItem value="MEMBER">
                        {t("roles.member")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>{t("roleDescription")}</FormDescription>
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
