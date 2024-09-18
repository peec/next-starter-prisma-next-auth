import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/components/forms/auth/register-form/schema";

export const PasswordResetFormSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirm_password: z.string().min(MIN_PASSWORD_LENGTH),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirm_password"],
      });
    }
  });

export type PasswordResetFormDataInputs = z.infer<
  typeof PasswordResetFormSchema
>;
