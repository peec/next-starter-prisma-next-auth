"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function Pager({
  pages,
  currentPage,
}: {
  pages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const handlePageChange = function handleSearch(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page === 0) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    push(`${pathname}?${params.toString()}`);
  };
  const getPaginationRange = () => {
    const visibleItems = 7; // Number of pages to show

    // Calculate the start and end of the range
    let start = Math.max(0, currentPage - Math.floor(visibleItems / 2));
    let end = start + visibleItems;

    // Adjust start and end if we're near the last page
    if (end > pages) {
      end = pages;
      start = Math.max(0, end - visibleItems); // Ensure we show 7 items
    }

    // Generate the pagination range
    const paginationRange = [];
    for (let i = start; i < end; i++) {
      paginationRange.push({
        index: i,
        label: i + 1,
      });
    }

    return paginationRange;
  };

  if (pages === 0) return null;
  const paginationRange = getPaginationRange();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="mr-2">
          <Button
            disabled={currentPage === 0}
            type="button"
            variant="ghost"
            onClick={() => handlePageChange(0)}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
        </PaginationItem>
        {paginationRange.map((page) => (
          <PaginationItem key={page.index}>
            <PaginationLink
              className={cn({
                "bg-secondary": page.index === currentPage,
              })}
              onClick={() => handlePageChange(page.index)}
            >
              {page.label}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem className="ml-1">
          <Button
            type="button"
            variant="ghost"
            disabled={pages - 1 === currentPage}
            onClick={() => handlePageChange(pages - 1)}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
