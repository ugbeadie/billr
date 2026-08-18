"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * True when we're allowed to animate.
 *
 * Deliberately not framer's useReducedMotion: that one reads matchMedia into
 * useState, so a reduced-motion client's first render disagrees with the HTML
 * the server sent and React logs a hydration mismatch. useSyncExternalStore
 * declares a server snapshot, so React knows to re-render instead of warn.
 */
export function useMotionOK() {
  return !useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The one reveal used across the page. Nothing scales, nothing lifts. */
export const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const revealTransition = {
  duration: 0.5,
  ease: [0.22, 0.61, 0.36, 1] as const,
};

/**
 * Spread onto a motion element for a scroll-triggered reveal. The 12px of
 * travel is dropped for reduced-motion users by the MotionConfig wrapper in
 * MotionProvider, leaving a plain fade.
 */
export const revealProps = {
  variants: reveal,
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.2 },
  transition: revealTransition,
};
