import { z } from "zod";

export const inviteMemberFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  role: z.enum(["MEMBER", "OWNER"]),
});
