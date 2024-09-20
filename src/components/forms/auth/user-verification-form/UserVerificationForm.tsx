"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  resendVerificationToken,
  verifyAccount,
} from "@/components/forms/auth/user-verification-form/actions";
import { APP_NAME } from "@/settings";
import { useConfirm } from "@/hooks/alert";

export default function UserVerificationForm({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
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
          title: "Account verified.",
          description: "You may login.",
        });
        router.push(`/login?callbackUrl=${callbackUrl}`);
      } else {
        if (res.errorCode === "token_expired") {
          const resend = await confirm({
            title: "Verification expired",
            body: "Your verification link has expired, you may send a new verification email below.",
            cancelButton: "Close",
            actionButton: "Resend verification e-mail",
          });
          if (resend) {
            const resent = await resendVerificationToken(res.email);
            if (resent.success) {
              toast({
                description:
                  "Your verification token has been sent, please close this window.",
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
        <h1 className="text-3xl font-bold">Verify account</h1>
        {!pageInvalid && (
          <p className="text-balance text-muted-foreground">
            Verify your account on {APP_NAME} by clicking{" "}
            <strong>Verify account</strong> below.
          </p>
        )}
        {pageInvalid && (
          <p className="text-balance text-muted-foreground">
            Please close this window.
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
          Verify account
          {pending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
