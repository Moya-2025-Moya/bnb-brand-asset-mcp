"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full header-gradient-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/bnb-logo.svg" alt="BNB Chain" width={34} height={34} />
          <span className="text-lg font-bold">BNB Dev Suite</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/generate">Start Building</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
