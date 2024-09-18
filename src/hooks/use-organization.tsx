import { useContext } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";

export function useOrganization() {
  const context = useContext(OrganizationContext);
  const organization = context.organization;
  const organizationMember = context.organizationMember;
  if (!organization || !organizationMember) {
    throw new Error(`UserProvider must be at the parent level`);
  }
  return { organization, organizationMember };
}
