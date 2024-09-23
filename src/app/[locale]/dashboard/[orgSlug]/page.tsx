import { authorizedOrganization } from "@/auth";

export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  await authorizedOrganization(orgSlug);

  return `Boilerplate plage, add your widgets here..`;
}
