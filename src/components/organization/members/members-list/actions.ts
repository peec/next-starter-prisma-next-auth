"use server";

import { prisma } from "@/lib/prisma";
import { securedOrganizationAction } from "@/lib/action-utils";
import z from "zod";

export const revokeInvitation = securedOrganizationAction(
  z.object({
    id: z.string(),
  }),
  async (data, { organization }) => {
    try {
      await prisma.organizationInvite.delete({
        where: {
          id: data.id,
          orgId: organization.id,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Error removing invitation",
      };
    }
  },
);

export const removeMember = securedOrganizationAction(
  z.object({
    id: z.string(),
  }),
  async (data, { organization, user }) => {
    try {
      const member = await prisma.organizationMember.findFirst({
        where: {
          orgId: organization.id,
          id: data.id,
        },
      });
      if (!member) {
        return {
          success: false,
          error: "Member not found",
        };
      }
      if (user.id === member.userId) {
        return {
          success: false,
          error: "You can not remove your self from the organization.",
        };
      }

      await prisma.organizationMember.delete({
        where: {
          id: member.id,
          orgId: organization.id,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Error removing invitation",
      };
    }
  },
);
