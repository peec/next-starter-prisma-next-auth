import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { addOrganization } from "@/components/forms/add-organization-form/actions";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.dashboard");
  const { user } = await authenticated();

  const organization = await prisma.organization.findFirst({
    select: { slug: true },
    where: {
      organizationMembers: {
        some: {
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
      return <p>{t("errors.error_create_org")}</p>;
    }
  }
}
