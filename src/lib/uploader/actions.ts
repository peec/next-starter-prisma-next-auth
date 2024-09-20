"use server";

import { authenticated, authorizedOrganization } from "@/auth";
import { createWritableContainerSas } from "@/lib/uploader/azure";

export async function createWritableGlobalSas() {
  await authenticated({ action: true });
  return createWritableContainerSas({
    containerName: "global",
  });
}

export async function createWritableOrganizationSas(organizationId: string) {
  await authorizedOrganization({ id: organizationId });
  return createWritableContainerSas({
    containerName: `org-${organizationId}`,
  });
}
