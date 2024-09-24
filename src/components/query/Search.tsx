"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "usehooks-ts";

export default function Search({ placeholder }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  const handleSearch = function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // always delete page
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };
  const debounced = useDebounceCallback(handleSearch, 400);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        ref={ref}
        placeholder={placeholder}
        onChange={(e) => {
          debounced(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString() || ""}
        type="text"
        className="w-full pr-10"
      />
      <Button
        disabled={!searchParams.get("query")?.toString()}
        onClick={() => {
          if (ref.current) {
            ref.current.value = "";
            handleSearch("");
          }
        }}
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-muted/50"
      >
        <XIcon className="w-4 h-4" />
        <span className="sr-only">Clear search</span>
      </Button>
    </div>
  );
}
