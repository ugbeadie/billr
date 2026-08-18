"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Wordmark from "./Wordmark";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled
          ? "border-b border-[#E5E7EB] bg-white/85 backdrop-blur"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
        >
          <Wordmark />
          <span className="sr-only">Trackr home</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/login"
            className="hidden rounded-md px-2 py-1 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 sm:inline-block"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-md bg-[#3A9AFF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2"
          >
            Start tracking
          </Link>
        </div>
      </nav>
    </header>
  );
}
