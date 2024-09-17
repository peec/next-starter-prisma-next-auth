import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addOrganization } from "@/app/dashboard/actions";

export default async function Page() {
  const { session, user } = await authenticated();

  // @todo use cookie here for preference or a global settings for user in db
  const organization = await prisma.organization.findFirst({
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
    redirect(`/dashboard/${org.slug}`);
  }

  return (
    <div>
      <pre>{JSON.stringify({ user, session }, null, 4)}</pre>
    </div>
  );
}
