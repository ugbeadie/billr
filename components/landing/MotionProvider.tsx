"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Drops transform animations under reduced motion, so reveals fade in place.
 * The animations that carry meaning are gated separately with useMotionOK.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
