import type { NextAuthConfig } from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import Google from "@auth/core/providers/google";
import { Provider } from "@auth/core/providers";

const providers: Provider[] = [
  Google,
  Credentials({
    name: "Sign in",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "example@example.com",
      },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: String(credentials.email),
        },
      });
      if (user?.password === null) {
        return null;
      }

      if (
        !user ||
        !(await compare(String(credentials.password), user.password))
      ) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    },
  }),
];


export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export default {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: providers,
} satisfies NextAuthConfig;
