"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-fetches the current route when the tab returns to the foreground.
 *
 * Jobs saved from the browser extension are written straight to the database,
 * which an already-open page has no way to hear about: revalidatePath clears
 * the server cache but pushes nothing to clients that are already rendered.
 * Coming back to the tab is exactly when the user expects to see the change.
 */
export default function RefreshOnFocus() {
  const router = useRouter();
  const lastRefresh = useRef(0);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;

      // focus and visibilitychange both fire on tab return, hence the throttle.
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
