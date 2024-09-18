import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addOrganization } from "@/app/dashboard/actions";

export default async function Page() {
  const { user } = await authenticated();

  const organization = await prisma.organization.findFirst({
    select: { slug: true },
    where: {
      organizationMembers: {
        every: {
          userId: user.id,
        },
      },
    },
  });

  if (organization) {
    redirect(`/dashboard/${organization.slug}`);
  } else {
    const org = await addOrganization("Default");
    console.log(`add default organization for user`);
    redirect(`/dashboard/${org.slug}`);
  }
}
