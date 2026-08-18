"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import LogoutButton from "./LogoutButton";
import NavToggleButton from "./NavToggleButton";

export default function Navbar({ user }: { user?: any }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/85 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
        >
          <Image
            src="/images/logo.png"
            alt=""
            aria-hidden
            width={24}
            height={24}
            priority
            className="h-6 w-6"
          />
          <span className="text-xl font-bold leading-none tracking-[-0.045em] text-[#111827]">
            trackr
          </span>
          <span className="sr-only">Trackr home</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && <NavToggleButton />}

          {user && (
            <>
              <div className="hidden h-6 w-px bg-[#E5E7EB] sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label="Account menu"
                    className="relative h-9 w-9 shrink-0 rounded-full p-0 hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#3A9AFF] text-sm font-medium text-white">
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-lg"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-[#3A9AFF] text-sm font-medium text-white">
                          {user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#111827]">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-[#6B7280]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-[#E5E7EB]" />

                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
