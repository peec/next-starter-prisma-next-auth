"use client";

import { Button } from "@/components/ui/button";
import { OrganizationDocument } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/use-organization";
import { useConfirm } from "@/hooks/alert";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  FileIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import { imageUrlFor } from "@/lib/uploader/url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeDocument } from "@/components/organization/documents/actions";
import { formatBytes } from "@/lib/files";

export default function DocumentsList({
  documents,
  count,
}: {
  documents: OrganizationDocument[];
  count: number;
}) {
  const t = useTranslations("components.documents-list");
  const confirm = useConfirm();
  const { organization, sasToken } = useOrganization();
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveDocument = async (document: OrganizationDocument) => {
    const remove = await confirm({
      title: t("remove-dialog.title"),
      body: t("remove-dialog.body", { fileName: document.fileName }),
      cancelButton: t("remove-dialog.cancelButton"),
      actionButton: t("remove-dialog.actionButton"),
      actionButtonVariant: "destructive",
    });
    if (remove) {
      const result = await removeDocument(organization.id, {
        id: document.id,
      });
      if (result.success) {
        toast({
          variant: "default",
          description: <p>{t("remove-toast.success")}</p>,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          description: result.error,
        });
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        {documents.length === 0 && (
          <p className="w-full py-4 text-muted-foreground">
            {t("no-documents")}
          </p>
        )}
        {documents.map((document) => {
          const url = imageUrlFor(document.fileUrl, sasToken) || "";
          return (
            <div
              key={document.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <FileIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">
                    <a target="_blank" className="hover:underline" href={url}>
                      {document.fileName}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatBytes(document.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {t("document-item.actions")}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleRemoveDocument(document)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      <span>{t("document-item.remove-document")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <a target="_blank" href={url}>
                  <Button variant="outline">
                    {t("document-item.open")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
