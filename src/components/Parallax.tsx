"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Moves its child a little slower than the page as it passes through the
 * viewport. The child is scaled to cover the extra travel, so the frame never
 * shows an edge — the overflow-hidden frame belongs to the caller.
 */
export function Parallax({
  children,
  distance = 48,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
