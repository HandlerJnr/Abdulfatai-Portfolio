"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Pulls a target gently toward the pointer while it is hovered, and springs
 * back on leave. Used only on the few links that are genuinely the point of a
 * page — it stops feeling like craft the moment everything does it.
 *
 * Pointer-coarse devices get nothing: there is no hover on a phone, and the
 * transform would only fight the tap.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.35 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  if (reduce) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`inline-block [@media(pointer:coarse)]:!transform-none ${className ?? ""}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
