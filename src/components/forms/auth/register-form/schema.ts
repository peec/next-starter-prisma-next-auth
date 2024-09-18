import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 4;

export const RegisterFormDataSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email().min(1),
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

export type RegisterFormDataInputs = z.infer<typeof RegisterFormDataSchema>;
