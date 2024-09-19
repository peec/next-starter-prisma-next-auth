import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import EditOrganizationForm from "@/components/forms/organization/settings/edit-organization-form/EditOrganizationForm";
import PageTitle from "@/components/layout/PageTitle";
export default async function Page({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const { organization } = await authorizedOrganization(orgSlug, [
    OrganizationMemberRole.OWNER,
  ]);
  return (
    <div>
      <PageTitle
        title="Organization settings"
        description="Manage your organization here"
      />
      <div className="grid gap-6 max-w-lg">
        <EditOrganizationForm organization={organization} />
      </div>
    </div>
  );
}
