import z from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  FROM_EMAIL: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  BASE_URL: z.string().min(1),
  EMAIL_TO_CONSOLE: z.string().optional()
});

// You can't destruct `process.env` as a regular object, so you have to do it manually here.
export const serverEnv = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  FROM_EMAIL: process.env.FROM_EMAIL,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_TO_CONSOLE: process.env.EMAIL_TO_CONSOLE,
  BASE_URL:
    process.env.BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""),
});
