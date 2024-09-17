import { authorizedOrganization } from "@/auth";

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const { organization } = await authorizedOrganization(orgSlug);

  return `You are in ${organization.name}`;
}
