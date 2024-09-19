"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Organization, OrganizationMember } from "@prisma/client";
import { MenuItem } from "@/components/layout/types";
import OrganizationSelector from "@/components/layout/OrganizationSelector";

export default function MobileMenu({
  menu,
  sidebarBottom,
}: {
  menu: Omit<MenuItem, "roles">[];
  sidebarBottom?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          {menu.map((item) => {
            return (
              <Link
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                {item.iconMobile}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">{sidebarBottom}</div>
      </SheetContent>
    </Sheet>
  );
}
