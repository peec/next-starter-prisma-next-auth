import { z } from "zod";

export const ForgotPasswordFormDataSchema = z.object({
  email: z.string().email().min(1),
});

export type ForgotPasswordFormDataInputs = z.infer<
  typeof ForgotPasswordFormDataSchema
>;
