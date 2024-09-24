"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DropZone from "@/components/uploads/DropZone";
import { uploadOrganizationDocuments } from "@/uploads";
import { Organization } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function UploadDialog({
  organization,
}: {
  organization: Organization;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("pages.dashboard/documents");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="h-9 gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {t("buttons.uploadFiles")}
        </span>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("uploadDialog.title")}</DialogTitle>
          <DialogDescription>{t("uploadDialog.description")}</DialogDescription>
        </DialogHeader>
        <DropZone
          action={{
            type: "organization",
            organizationId: organization.id,
            action: uploadOrganizationDocuments,
          }}
          onSuccess={() => {
            setOpen(false);
          }}
          multi
        />
      </DialogContent>
    </Dialog>
  );
}
