import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";
import PageTitle from "@/components/layout/PageTitle";
import { getTranslations } from "next-intl/server";
import UploadDialog from "@/app/[locale]/dashboard/[orgSlug]/documents/_components/UploadDialog";
import Search from "@/components/query/Search";
import { Suspense } from "react";
import DocumentsListSkeleton from "@/components/organization/documents/DocumentsListSkeleton";
import FilteredDocumentsList from "@/app/[locale]/dashboard/[orgSlug]/documents/_components/FilteredDocumentsList";

export default async function Page({
  params: { orgSlug },
  searchParams,
}: {
  params: { orgSlug: string };
  searchParams?: { query?: string; page?: number };
}) {
  const query = searchParams?.query;
  const page = Number(searchParams?.page || 0);
  const t = await getTranslations("pages.dashboard/documents");
  const { organization } = await authorizedOrganization(orgSlug, [
    OrganizationMemberRole.OWNER,
  ]);

  return (
    <div>
      <PageTitle title={t("title")} description={t("description")} />

      <div className="flex items-center  mb-4 gap-4">
        <Search placeholder={t("search")} />
        <div className="ml-auto flex items-center gap-2">
          <div className="flex justify-between items-center">
            <UploadDialog organization={organization} />
          </div>
        </div>
      </div>
      <Suspense key={query} fallback={<DocumentsListSkeleton />}>
        <FilteredDocumentsList
          organizationId={organization.id}
          query={query}
          page={page}
        />
      </Suspense>
    </div>
  );
}
