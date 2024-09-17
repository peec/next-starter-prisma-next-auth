import NextAuth, { Session } from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrganizationMemberRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth?.user;
    },
  },
});

/**
 * Checks if user is authenticated, and found in database - if not it will redirect to signin.
 * Returns:
 * - session jwt object ( from provider )
 * - user object (from db)
 * - can() method that can be used for fine-grained permission checking or just if the user has a role and role is super admin.
 */
export async function authenticated({
  callbackUrl,
}: {
  callbackUrl?: string;
} = {}) {
  const session = await auth();

  const redirectTo = "/api/auth/signin?callbackUrl=" + callbackUrl;
  if (!session?.user) {
    redirect(redirectTo);
  }

  if (!session?.user?.email) {
    console.warn(
      `session.user as no email, wrong scope from provider? must have access to email`,
      session.user,
    );
    redirect(redirectTo);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    redirect(redirectTo);
  }

  return { session, user };
}

export async function authorizedOrganization(
  organizationSlug: string,
  requiredRole?: OrganizationMemberRole,
) {
  const auth = await authenticated();

  const organizationMember = await prisma.organizationMember.findFirst({
    where: {
      userId: auth.user.id,
      organization: {
        slug: organizationSlug,
      },
    },
  });

  if (!organizationMember) {
    redirect(`/error/no-access?org=${organizationSlug}`);
  }

  const organization = await prisma.organization.findFirst({
    where: {
      AND: {
        slug: organizationSlug,
        organizationMembers: {
          some: {
            id: organizationMember.id,
          },
        },
      },
    },
  });

  if (!organization) {
    redirect(`/error/no-access?org=${organizationSlug}`);
  }

  if (requiredRole && organizationMember.role !== requiredRole) {
    redirect(`/dashboard/${organizationSlug}/error/unauthorized`);
  }

  return {
    organizationMember,
    organization,
    ...auth,
  };
}
