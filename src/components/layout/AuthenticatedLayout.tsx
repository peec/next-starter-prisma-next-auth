import { Link } from "@/i18n/routing";
import { CircleUser, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from "@/settings";
import React, { ReactNode } from "react";
import { signOut } from "@/auth";
import { User } from "@prisma/client";
import { MenuItem } from "@/components/layout/types";
import MobileMenu from "@/components/layout/MobileMenu";
import { ThemeModeToggle } from "@/components/layout/ThemeModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrlFor } from "@/lib/uploader/url";
import { SasToken } from "@/lib/uploader/types";
import { getTranslations } from "next-intl/server";

export async function AuthenticatedLayout({
  children,
  user,
  menu,
  homeUrl,
  sidebarBottom,
  header,
  sasToken,
  title = APP_NAME,
}: {
  homeUrl: string;
  user: Omit<User, "password">;
  children: ReactNode;
  menu: Omit<MenuItem, "roles">[];
  sidebarBottom?: ReactNode;
  header?: ReactNode;
  title?: string;
  sasToken: SasToken | null;
}) {
  const t = await getTranslations("layout");
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-accent bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-accent px-4 lg:h-[60px] lg:px-6">
            <Link
              href={homeUrl}
              className="flex items-center gap-2 font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="">{title}</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menu.map((item) => {
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
          <div className="mt-auto p-4">{sidebarBottom}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-accent bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileMenu menu={menu} sidebarBottom={sidebarBottom} />
          <div className="w-full flex-1">{header}</div>
          <ThemeModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={imageUrlFor(user.image, sasToken) || ""}
                    alt={user.name || user.email}
                  />
                  <AvatarFallback className="text-sm">
                    {(user.name || user.email)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">{t("toggleUserMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href="/account">{t("manageProfile")}</Link>
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
                    {t("signOut")}
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
