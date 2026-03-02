"use client";

import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "@/server/actions";
import { useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onSelect={(e) => e.preventDefault()} // 👈 prevent auto close
      onClick={() => {
        startTransition(async () => {
          await signOut();
        });
      }}
      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging out...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </div>
      )}
    </DropdownMenuItem>
  );
}
