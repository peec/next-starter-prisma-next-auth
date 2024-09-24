import { authorizedOrganization } from "@/auth";
import { OrganizationMemberRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import DocumentsList from "@/components/organization/documents/DocumentsList";
import Pager from "@/components/query/Pager";

export default async function FilteredDocumentsList({
  organizationId,
  query,
  page = 0,
}: {
  query?: string;
  page?: number;
  organizationId: string;
}) {
  const { organization } = await authorizedOrganization(
    { id: organizationId },
    [OrganizationMemberRole.OWNER],
  );

  const filters: Prisma.OrganizationDocumentWhereInput = {};
  if (query) {
    filters.fileName = { contains: query };
  }
  const args: Prisma.OrganizationDocumentFindManyArgs = {
    where: { orgId: organization.id, ...filters },
    orderBy: {
      fileName: "asc",
    },
  };
  const limit = 10;
  const [documents, count] = await prisma.$transaction([
    prisma.organizationDocument.findMany({
      ...args,
      skip: (page || 0) * limit,
      take: limit,
    }),
    prisma.organizationDocument.count({ where: args.where }),
  ]);

  const numPages = Math.round(count / limit);
  return (
    <div>
      <DocumentsList count={count} documents={documents} />
      <div className="mt-8">
        <Pager pages={numPages} currentPage={page} />
      </div>
    </div>
  );
}
