"use server";

import { prisma } from "@/lib/prisma";
import { securedOrganizationAction } from "@/lib/action-utils";
import z from "zod";
import { getTranslations } from "next-intl/server";
import { OrganizationMemberRole } from "@prisma/client";

export const revokeInvitation = securedOrganizationAction(
  z.object({
    id: z.string(),
  }),
  async (data, { organization }) => {
    const t = await getTranslations("components.members-list");
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
        error: t("errors.invitation.unknown_error"),
      };
    }
  },
  {
    requiredRoles: [OrganizationMemberRole.OWNER],
  },
);

export const removeMember = securedOrganizationAction(
  z.object({
    id: z.string(),
  }),
  async (data, { organization, user }) => {
    const t = await getTranslations("components.members-list");
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
          error: t("errors.member.member_not_found"),
        };
      }
      if (user.id === member.userId) {
        return {
          success: false,
          error: t("errors.member.remove_self"),
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
        error: t("errors.member.unknown_error"),
      };
    }
  },
  {
    requiredRoles: [OrganizationMemberRole.OWNER],
  },
);

export const changeRole = securedOrganizationAction(
  z.object({
    id: z.string(),
    role: z.enum([OrganizationMemberRole.OWNER, OrganizationMemberRole.MEMBER]),
  }),
  async (data, { organization, user }) => {
    const t = await getTranslations("components.members-list");
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
          error: t("errors.member.member_not_found"),
        };
      }
      if (user.id === member.userId) {
        return {
          success: false,
          error: t("errors.member.change_role_self"),
        };
      }

      await prisma.organizationMember.update({
        data: {
          role: data.role,
        },
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
        error: t("errors.member.unknown_error"),
      };
    }
  },
  {
    requiredRoles: [OrganizationMemberRole.OWNER],
  },
);
