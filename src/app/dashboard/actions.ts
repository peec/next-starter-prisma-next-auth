"use server";

import { auth, authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrganizationMemberRole } from "@prisma/client";
import slugify from "slugify";

export async function addOrganization(name: string) {
  const { user } = await authenticated();

  const slugged = slugify(name.substring(0, 50));
  const slugCount = await prisma.organization.count({
    where: { slug: { startsWith: slugged } },
  });
  const orgSlug = `${slugged}${slugCount === 0 ? "" : `-${slugCount + 1}`}`;

  const org = await prisma.organization.create({
    data: { name: name, slug: orgSlug, ownerId: user.id },
  });
  await prisma.organizationMember.create({
    data: {
      orgId: org.id,
      userId: user.id,
      role: OrganizationMemberRole.OWNER,
    },
  });
  return org;
}
