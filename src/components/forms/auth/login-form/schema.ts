import { z } from "zod";

export const LoginFormDataSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export type LoginFormDataInputs = z.infer<typeof LoginFormDataSchema>;
