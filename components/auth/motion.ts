/** Travel is dropped for reduced-motion users by MotionConfig in AuthShell. */
export const authContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const authItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};
