import { z } from "zod";
import { Organization } from "@prisma/client";

export const inviteMemberFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  role: z.enum(["MEMBER", "OWNER"]),
});

export type InviteHandler = (
  organization: Organization,
  values: z.infer<typeof inviteMemberFormSchema>,
) => Promise<{ success: true } | { success: false; error: string }>;
