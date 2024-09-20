"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import React, { ChangeEvent, useTransition } from "react";
import { upload } from "@/lib/uploader/client";
import { setProfilePicture } from "@/components/account/actions";
import { imageUrlFor } from "@/lib/uploader/url";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ProfilePictureUploader() {
  const [pending, startTransaction] = useTransition();
  const { user, sasToken } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    startTransaction(async () => {
      if (event.target?.files?.length === 1) {
        const filesUploaded = await upload("global", [event.target.files[0]]);
        if (filesUploaded[0].success) {
          const res = await setProfilePicture(filesUploaded[0].url);
          if (res.success) {
            toast({
              title: "Profile picture updated",
            });
            router.refresh();
          }
        }
      }
    });
  }

  return (
    <div>
      <Avatar className="h-40 w-40">
        <AvatarImage
          src={imageUrlFor(user.image, sasToken) || ""}
          alt={user.name || user.email}
        />
        <AvatarFallback className="text-4xl">
          {(user.name || user.email)
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <Label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer transition-colors"
      >
        {pending ? (
          <ReloadIcon className="h-6 w-6 animate-spin" />
        ) : (
          <Pencil className="h-6 w-6" />
        )}
        <input
          disabled={pending}
          id="avatar-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={onChange}
        />
      </Label>
    </div>
  );
}
