"use client";

import { useState } from "react";
import { PlusCircle, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Organization, OrganizationMemberRole } from "@prisma/client";
import AddOrganizationForm from "@/components/forms/add-organization-form/AddOrganizationForm";
import { Link } from "@/i18n/routing";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslations } from "next-intl";

export default function OrganizationSelector({
  organization,
  organizations,
}: {
  organization: Organization;
  organizations: Organization[];
}) {
  const t = useTranslations("components.organization-selector");
  const currentOrg = useOrganization();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectOrg = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <div className="space-y-4 w-full max-w-[200px]">
      <div className="flex gap-2">
        <Select value={organization.slug} onValueChange={handleSelectOrg}>
          <SelectTrigger>
            <SelectValue placeholder={t("dropdown.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.slug}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentOrg.organizationMember.role ===
          OrganizationMemberRole.OWNER && (
          <Button
            size="icon"
            variant="ghost"
            title={t("settingsLabel")}
            asChild
          >
            <Link href={`/dashboard/${organization.slug}/settings`}>
              <SettingsIcon className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("dialog.addButton")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
          </DialogHeader>
          <AddOrganizationForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
