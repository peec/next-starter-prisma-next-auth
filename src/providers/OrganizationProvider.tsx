"use client";
import React, { ReactNode } from "react";
import { Organization, OrganizationMember, User } from "@prisma/client";
import { SasToken } from "@/lib/uploader/types";

export const OrganizationContext = React.createContext<{
  organizationMember: OrganizationMember | null;
  organization: Organization | null;
  sasToken: null | SasToken;
}>({
  organizationMember: null,
  organization: null,
  sasToken: null,
});

export default function OrganizationProvider({
  organization,
  organizationMember,
  sasToken,
  children,
}: {
  organization: Organization;
  organizationMember: OrganizationMember;
  sasToken: SasToken | null;
  children: ReactNode;
}) {
  return (
    <OrganizationContext.Provider
      value={{ sasToken, organization, organizationMember }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
