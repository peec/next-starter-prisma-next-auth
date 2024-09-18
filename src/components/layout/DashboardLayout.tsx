import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/settings";
import { ReactNode } from "react";
import { signOut } from "@/auth";
import { Organization, OrganizationMember, User } from "@prisma/client";
import { MenuItem } from "@/components/layout/types";
import MobileMenu from "@/components/layout/MobileMenu";

export function DashboardLayout({
  children,
  organization,
  user,
  organizationMember,
}: {
  organizationMember: OrganizationMember;
  user: Omit<User, "password">;
  children: ReactNode;
  organization: Organization;
}) {
  const orgUrl = `/dashboard/${organization.slug}`;
  const menu: MenuItem[] = [
    {
      href: orgUrl,
      name: "Dashboard",
      iconDesktop: <Home className="h-4 w-4" />,
      iconMobile: <Home className="h-5 w-5" />,
    },
    {
      href: `${orgUrl}/members`,
      name: "Members",
      iconDesktop: <Users className="h-4 w-4" />,
      iconMobile: <Users className="h-5 w-5" />,
      role: "OWNER",
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href={orgUrl}
              className="flex items-center gap-2 font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="">{APP_NAME}</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menu.map((item) => {
                if (item.role && organizationMember.role !== item.role) {
                  return null;
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    {item.iconDesktop}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">{organization.name}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileMenu
            organizationMember={organizationMember}
            organization={organization}
            menu={menu}
          />
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search ..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <span>{user.name || user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button type="submit" className="w-full text-left">
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
