import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/components/forms/auth/register-form/schema";

export const setPasswordFormSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH),
    confirmNewPassword: z.string().min(MIN_PASSWORD_LENGTH),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmNewPassword"],
      });
    }
  });
