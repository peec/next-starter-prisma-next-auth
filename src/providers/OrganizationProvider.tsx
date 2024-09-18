"use client";
import React, { ReactNode } from "react";
import { Organization, OrganizationMember, User } from "@prisma/client";

export const OrganizationContext = React.createContext<{
  organizationMember: OrganizationMember | null;
  organization: Organization | null;
}>({
  organizationMember: null,
  organization: null,
});

export default function OrganizationProvider({
  organization,
  organizationMember,
  children,
}: {
  organization: Organization;
  organizationMember: OrganizationMember;
  children: ReactNode;
}) {
  return (
    <OrganizationContext.Provider value={{ organization, organizationMember }}>
      {children}
    </OrganizationContext.Provider>
  );
}
