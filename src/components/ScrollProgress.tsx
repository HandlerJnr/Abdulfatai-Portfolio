"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * A hairline reading-progress bar for long case studies. It sits under the
 * nav, not over it, so it never competes with the logo or the menu button.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-[72px] z-[60] h-px w-full origin-left bg-accent"
    />
  );
}
