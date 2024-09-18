import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // nothing here yet.
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
