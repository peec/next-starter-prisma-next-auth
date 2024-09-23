"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  resendVerificationToken,
  verifyAccount,
} from "@/components/forms/auth/user-verification-form/actions";
import { APP_NAME } from "@/settings";
import { useConfirm } from "@/hooks/alert";
import { useTranslations } from "next-intl";

export default function UserVerificationForm({
  token,
  callbackUrl,
}: {
  token: string;
  callbackUrl: string;
}) {
  const t = useTranslations("forms.user-verification-form");
  const [pending, startTransaction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const confirm = useConfirm();

  const [pageInvalid, setPageInvalid] = useState(false);

  async function onClick() {
    startTransaction(async () => {
      const res = await verifyAccount(token);
      if (res.success) {
        toast({
          title: t("toast.verified.title"),
          description: t("toast.verified.description"),
        });
        router.push(`/login?callbackUrl=${callbackUrl}`);
      } else {
        if (res.errorCode === "token_expired") {
          const resend = await confirm({
            title: t("confirmDialog.verificationExpired.title"),
            body: t("confirmDialog.verificationExpired.body"),
            cancelButton: t("confirmDialog.verificationExpired.cancelButton"),
            actionButton: t("confirmDialog.verificationExpired.actionButton"),
          });
          if (resend) {
            const resent = await resendVerificationToken(res.email);
            if (resent.success) {
              toast({
                description: t("toast.verificationTokenResent.description"),
              });
              setPageInvalid(true);
            } else {
              toast({
                variant: "destructive",
                description: res.error,
              });
            }
          }
        } else {
          toast({
            variant: "destructive",
            description: res.error,
          });
        }
      }
    });
  }

  return (
    <div>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {!pageInvalid && (
          <p className="text-balance text-muted-foreground">
            {t("instructions.valid", { appName: APP_NAME })}
          </p>
        )}
        {pageInvalid && (
          <p className="text-balance text-muted-foreground">
            {t("instructions.invalid")}
          </p>
        )}
      </div>
      <div className="grid gap-4 mt-4">
        <Button
          onClick={onClick}
          type="button"
          className="w-full"
          disabled={pending || pageInvalid}
        >
          {t("verifyButton")}
          {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
