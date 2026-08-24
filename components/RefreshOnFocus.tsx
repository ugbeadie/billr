"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-fetches the route when the tab regains focus. Jobs saved from the
 * extension go straight to the database, and revalidatePath pushes nothing to
 * pages that are already rendered.
 */
export default function RefreshOnFocus() {
  const router = useRouter();
  const lastRefresh = useRef(0);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;

      // Both events fire on tab return, hence the throttle.
      const now = Date.now();
      if (now - lastRefresh.current < 1000) return;
      lastRefresh.current = now;

      router.refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  return null;
}
