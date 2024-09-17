import { ReactNode } from "react";
import { OrganizationMemberRole } from "@prisma/client";

export type MenuItem = {
  href: string;
  name: string;
  iconDesktop: ReactNode;
  iconMobile: ReactNode;
  role?: OrganizationMemberRole;
};
