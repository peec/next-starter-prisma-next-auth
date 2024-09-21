"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import React, { useRef, useTransition } from "react";
import { imageUrlFor } from "@/lib/uploader/url";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { uploadProfilePicture } from "@/uploads";

export default function ProfilePictureUploader() {
  const { user, sasToken } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  async function onChange() {
    ref.current?.requestSubmit();
  }

  return (
    <form
      ref={ref}
      action={async (formData) => {
        start(async () => {
          const res = await uploadProfilePicture(formData);
          if (res.success) {
            ref.current?.reset();
            router.refresh();
            toast({
              description: "Updated profile picture",
            });
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
      }}
    >
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
          name="file"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={onChange}
        />
      </Label>
    </form>
  );
}
