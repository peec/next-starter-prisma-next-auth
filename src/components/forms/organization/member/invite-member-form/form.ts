import { z } from "zod";
import {
  Organization,
  OrganizationInvite,
  OrganizationMember,
} from "@prisma/client";

export const inviteMemberFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  role: z.enum(["MEMBER", "OWNER"]),
});

export type InviteHandler = (
  organization: Organization,
  values: z.infer<typeof inviteMemberFormSchema>,
) => Promise<{ success: true } | { success: false; error: string }>;

export type RevokeHandler = (
  invitation: OrganizationInvite & { organization: { slug: string } },
) => Promise<{ success: true } | { success: false; error: string }>;

export type RemoveMemberHandler = (
  member: OrganizationMember & { organization: { slug: string } },
) => Promise<{ success: true } | { success: false; error: string }>;
