import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Invitation({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const t = await getTranslations("pages.invitation");
  // @todo probably change to secure token..
  const id = searchParams?.id;
  if (!id) {
    return <p className="text-center">{t("errors.id_not_found")}</p>;
  }

  const anonymousInvite = await prisma.organizationInvite.findFirst({
    where: {
      id: id,
    },
  });

  if (anonymousInvite) {
    await prisma.organizationInvite.update({
      data: {
        seenOnce: true,
      },
      where: {
        id: id,
      },
    });
  }

  const auth = await authenticated({ callbackUrl: `/invitation?id=${id}` });

  const invite = await prisma.organizationInvite.findFirst({
    where: {
      id: id,
      email: auth.user.email,
    },
  });
  if (!invite) {
    console.error(`could not find invite ${id} on user ${auth.user.email}`);
    return <p className="text-center">{t("errors.invite_not_found")}</p>;
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.organizationInvite.delete({
        where: {
          id: invite.id,
        },
      });
      await tx.organizationMember.create({
        data: {
          orgId: invite.orgId,
          userId: auth.user.id,
          role: invite.role,
        },
      });
    });
  } catch (error) {
    console.error(error);
    return <p className="text-center">{t("errors.unknown_error")}</p>;
  }
  const org = await prisma.organization.findFirstOrThrow({
    select: { slug: true },
    where: { id: invite.orgId },
  });
  redirect(`/dashboard/${org.slug}`);
}
