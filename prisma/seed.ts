import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({
    data: {
      name: "Administrator",
      isSuperAdmin: true,
    },
  });

  const createCommentPermission = await prisma.permission.create({
    data: {
      action: "create",
      resource: "comment",
    },
  });

  const contributorRole = await prisma.role.create({
    data: {
      name: "Contributor",
      permissions: {
        createMany: {
          data: [
            {
              permissionId: createCommentPermission.id,
            },
          ],
        },
      },
    },
  });

  const password = await hash("admin", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password,
      roleId: adminRole.id,
    },
  });

  const contributorPassword = await hash("contributor", 12);
  const contributorUser = await prisma.user.upsert({
    where: { email: "contributor@contributor.com" },
    update: {},
    create: {
      email: "contributor@contributor.com",
      name: "Contributor",
      password,
      roleId: contributorRole.id,
    },
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
