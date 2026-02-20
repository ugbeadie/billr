"use client";

import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "@/server/actions";

export default function LogoutButton() {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOut();
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}
