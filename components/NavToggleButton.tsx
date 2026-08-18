"use client";

import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ArrowLeft, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function NavToggleButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isStats = pathname === "/stats";

  function handleClick() {
    startTransition(() => {
      router.push(isStats ? "/" : "/stats");
    });
  }

  return (
    <button
      id="stats-section"
      onClick={handleClick}
      disabled={isPending}
      className="
        relative inline-flex h-9 items-center justify-center
        gap-2 rounded-lg border border-[#E5E7EB] bg-white
        px-3 text-sm font-medium text-[#3A9AFF]
        transition-colors hover:border-[#3A9AFF]/40 hover:bg-[#E7F6FF]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50
        disabled:pointer-events-none disabled:opacity-60
      "
    >
      <span
        className={`inline-flex items-center gap-2 ${
          isPending ? "invisible" : "visible"
        }`}
      >
        {isStats ? (
          <>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Go back home</span>
            <span className="sm:hidden">Home</span>
          </>
        ) : (
          <>
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Go to stats</span>
            <span className="sm:hidden">Stats</span>
          </>
        )}
      </span>

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
    </button>
  );
}
