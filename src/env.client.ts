import z from "zod";

const envSchema = z.object({
  // NEXT_PUBLIC_EXAMPLE: z.string().min(1)
});

export const clientEnv = envSchema.parse({
  // NEXT_PUBLIC_EXAMPLE: process.env.NEXT_PUBLIC_EXAMPLE
});
