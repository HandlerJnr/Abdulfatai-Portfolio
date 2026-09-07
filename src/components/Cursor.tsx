"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type Mode = "default" | "view" | "link" | "hidden";

/**
 * Desktop-only custom cursor. Elements opt in with:
 *   data-cursor="view"  → expands with "VIEW" label
 *   data-cursor="link"  → shows an arrow state
 * pointer-events: none guarantees it never blocks clicks.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const reduce = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = { stiffness: 420, damping: 38, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (mode === "hidden") setMode("default");
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      if (!target) return setMode("default");
      const kind = target.dataset.cursor;
      if (kind === "view") return setMode("view");
      setMode("link");
    };
    const leave = () => setMode("hidden");
    const enter = () => setMode("default");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.body.classList.remove("has-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 96 : mode === "link" ? 44 : 14;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full mix-blend-normal"
      style={{
        x: reduce ? x : sx,
        y: reduce ? y : sy,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-accent text-white"
        animate={{
          width: size,
          height: size,
          opacity: mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {mode === "view" && (
          <span className="display text-[13px] tracking-[0.2em]">View</span>
        )}
        {mode === "link" && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 12 12 2M5 2h7v7" />
          </svg>
        )}
      </motion.div>
    </motion.div>
  );
}
