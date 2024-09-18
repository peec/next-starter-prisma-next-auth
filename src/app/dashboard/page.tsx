import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addOrganization } from "@/components/forms/add-organization-form/actions";

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
    const orgResponse = await addOrganization({
      name: user.name || user.email,
    });
    if (orgResponse.success) {
      console.log(`add default organization for user`);
      redirect(`/dashboard/${orgResponse.organization.slug}`);
    } else {
      return <p>Could not create organization, please reload this page.</p>;
    }
  }
}
