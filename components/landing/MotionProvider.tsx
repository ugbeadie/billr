"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` makes framer drop transform animations when the OS
 * asks for reduced motion, so the section reveals fade in place instead of
 * travelling. The three animations that carry meaning — the dropped card, the
 * parser run, the heatmap wipe — are gated separately with useMotionOK.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
