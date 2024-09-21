import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import EditOrganizationForm from "@/components/forms/organization/settings/edit-organization-form/EditOrganizationForm";
import PageTitle from "@/components/layout/PageTitle";
import LogoUploader from "@/components/forms/organization/settings/edit-organization-form/LogoUploader";

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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <EditOrganizationForm organization={organization} />
          </div>
        </div>
        <LogoUploader organization={organization} />
      </div>
      <div className="grid gap-6 max-w-lg"></div>
    </div>
  );
}
