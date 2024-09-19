import { CardTitle } from "@/components/ui/card";
import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import EditOrganizationForm from "@/components/forms/organization/settings/edit-organization-form/EditOrganizationForm";
export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const { organization } = await authorizedOrganization(orgSlug, [
    OrganizationMemberRole.OWNER,
  ]);
  return (
    <div className="w-full">
      <CardTitle className="text-3xl font-bold">
        {organization.name} settings
      </CardTitle>
      <div className="grid gap-6 mt-6">
        <EditOrganizationForm organization={organization} />
      </div>
    </div>
  );
}
