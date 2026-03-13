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
        relative inline-flex items-center justify-center
        gap-2 rounded-lg border
        px-3 py-1.5 text-primary text-sm font-medium
        transition hover:bg-gray-50
        disabled:opacity-60 disabled:pointer-events-none
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
            Go back home
          </>
        ) : (
          <>
            <BarChart3 className="h-4 w-4" />
            Go to stats
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
