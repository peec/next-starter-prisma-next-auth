"use client";

import { Button } from "@/components/ui/button";
import { CloudUploadIcon, FileIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  securedFormAction,
  securedOrganizationAction,
} from "@/lib/action-utils";
import { cn } from "@/lib/utils";

type Action =
  | {
      type: "organization";
      organizationId: string;
      action: ReturnType<typeof securedOrganizationAction>;
    }
  | {
      type: "authenticated";
      action: ReturnType<typeof securedFormAction>;
    };

export default function DropZone({
  multi,
  action,
  accept,
  onSuccess,
  refreshDataOnSuccess = true,
}: {
  multi?: boolean;
  accept?: string;
  action: Action;
  refreshDataOnSuccess?: boolean;
  onSuccess?: (data: any) => void;
}) {
  const t = useTranslations("components.drop-zone");
  const { toast } = useToast();
  const router = useRouter();
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onChange() {
    ref.current?.requestSubmit();
  }
  const handleDragOver = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent file from being opened
    setDragging(true); // Set dragging state
  };

  const handleDragLeave = () => {
    setDragging(false); // Reset dragging state
  };

  const handleDrop = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDragging(false);

    const droppedFiles = event.dataTransfer.files; // Get the dropped files

    // If there's a file input reference, set the files on it
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < droppedFiles.length; i++) {
        dataTransfer.items.add(droppedFiles[i]); // Add files to the data transfer
      }
      fileInputRef.current.files = dataTransfer.files; // Set the files on input element

      ref.current?.requestSubmit();
    }
  };

  const handleAction = (formData: FormData) => {
    if (pending) return;
    start(async () => {
      const res =
        action.type === "organization"
          ? await action.action(action.organizationId, formData)
          : await action.action(formData);
      if (res.success) {
        ref.current?.reset();
        if (refreshDataOnSuccess) {
          router.refresh();
        }
        toast({
          description: t("toasts.success"),
        });
        onSuccess && onSuccess(res);
      } else {
        if (res.validation) {
          toast({
            variant: "destructive",
            description: res.validation.map((v) => (
              <p key={v.path.join("-")}>{v.message}</p>
            )),
          });
        } else {
          toast({
            variant: "destructive",
            description: res.error,
          });
        }
      }
    });
  };
  return (
    <div className="grid w-full items-center gap-4">
      <form
        ref={ref}
        action={handleAction}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800",
          {
            "border-gray-400 bg-gray-200": dragging,
          },
        )}
      >
        <CloudUploadIcon className="h-10 w-10 text-gray-400 group-hover:text-gray-500 dark:text-gray-500" />
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {pending
            ? t("drop.title-loading")
            : multi
              ? t("drop.title-multi")
              : t("drop.title-single")}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pending
            ? t("drop.description-loading")
            : multi
              ? t("drop.description-multi")
              : t("drop.description-single")}
        </p>
        <Button variant="outline" className="mt-4">
          {multi ? t("button.multi") : t("button.single")}
        </Button>
        <input
          ref={fileInputRef}
          disabled={pending}
          onChange={onChange}
          type="file"
          name="files"
          multiple={multi}
          accept={accept}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </form>
    </div>
  );
}
