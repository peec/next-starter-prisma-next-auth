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
export async function authenticated(
  {
    callbackUrl = "/dashboard",
  }: {
    callbackUrl?: string;
  } = { callbackUrl: "/dashboard" },
) {
  const session = await auth();

  const redirectTo = "/login?callbackUrl=" + callbackUrl;
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
  // avoid leaking password though app
  const { password, ...userWithoutPassword } = user;

  return { session, user: userWithoutPassword };
}

export async function authorizedOrganization(
  organizationSlugOrId: string | { id: string },
  requiredRoles?: OrganizationMemberRole[],
) {
  const auth = await authenticated();

  const organizationMember = await (async () => {
    if (typeof organizationSlugOrId === "string") {
      return prisma.organizationMember.findFirst({
        where: {
          userId: auth.user.id,
          organization: {
            slug: organizationSlugOrId,
          },
        },
      });
    }
    return prisma.organizationMember.findFirst({
      where: {
        userId: auth.user.id,
        organization: {
          id: organizationSlugOrId.id,
        },
      },
    });
  })();

  if (!organizationMember) {
    redirect(`/error/no-access}`);
  }

  const organization = await prisma.organization.findFirst({
    where: {
      AND: {
        ...(typeof organizationSlugOrId === "string"
          ? {
              slug: organizationSlugOrId,
            }
          : {
              id: organizationSlugOrId.id,
            }),
        organizationMembers: {
          some: {
            id: organizationMember.id,
          },
        },
      },
    },
  });

  if (!organization) {
    redirect(`/error/no-access}`);
  }

  if (requiredRoles && !requiredRoles.includes(organizationMember.role)) {
    redirect(`/dashboard/${organization.slug}/error/unauthorized`);
  }

  return {
    organizationMember,
    organization,
    ...auth,
  };
}
