import NextAuth, { Session } from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
export async function authorized() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  if (!session?.user?.email) {
    console.warn(
      `session.user as no email, wrong scope from provider? must have access to email`,
      session.user,
    );
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session.user.email },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  function can(
    action: "create" | "read" | "update" | "delete",
    resource: string,
  ) {
    if (user.role?.isSuperAdmin) {
      return true;
    }

    return (
      user.role?.permissions?.some(
        (perm) =>
          perm.permission.action === action &&
          perm.permission.resource === resource,
      ) || false
    );
  }

  return { session, user, can };
}
