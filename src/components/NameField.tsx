"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The letters of the name, set very large and very faint, scattered behind the
 * hero. Each one is pushed away from the pointer and springs back once it
 * passes — the field reads as a surface that notices you, not as decoration.
 *
 * Positions are fixed constants, never random: a random layout would differ
 * between the server and the client and trip a hydration mismatch.
 *
 * Everything here is decorative. The layer is aria-hidden, never receives
 * pointer events, and is not rendered at all on touch devices or under
 * reduced-motion, where it would be inert weight.
 */
const LETTERS = [
  { ch: "A", x: 6, y: 16, s: 1.0 },
  { ch: "B", x: 20, y: 68, s: 0.78 },
  { ch: "D", x: 33, y: 10, s: 0.62 },
  { ch: "U", x: 47, y: 78, s: 0.86 },
  { ch: "L", x: 60, y: 14, s: 0.7 },
  { ch: "F", x: 74, y: 62, s: 0.95 },
  { ch: "A", x: 88, y: 22, s: 0.68 },
  { ch: "T", x: 94, y: 74, s: 0.8 },
  { ch: "A", x: 13, y: 42, s: 0.58 },
  { ch: "I", x: 41, y: 40, s: 0.52 },
  { ch: "J", x: 55, y: 50, s: 0.66 },
  { ch: "A", x: 68, y: 34, s: 0.55 },
  { ch: "M", x: 81, y: 46, s: 0.9 },
  { ch: "I", x: 27, y: 28, s: 0.5 },
  { ch: "U", x: 3, y: 58, s: 0.64 },
];

/** How close the pointer has to get, and how hard it shoves. */
const RADIUS = 260;
const FORCE = 90;

export function NameField() {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = host.current;
    if (!root) return;
    root.classList.remove("opacity-0");

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-letter]"),
    );
    // Current and target offsets per letter, integrated on one shared frame
    // loop rather than fifteen independent springs.
    const state = nodes.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      pointer = null;
    };

    const frame = () => {
      nodes.forEach((node, i) => {
        const st = state[i];
        if (pointer) {
          const b = node.getBoundingClientRect();
          const rr = root.getBoundingClientRect();
          const cx = b.left - rr.left + b.width / 2 - st.x;
          const cy = b.top - rr.top + b.height / 2 - st.y;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < RADIUS) {
            const push = (1 - dist / RADIUS) * FORCE;
            st.tx = (dx / dist) * push;
            st.ty = (dy / dist) * push;
          } else {
            st.tx = 0;
            st.ty = 0;
          }
        } else {
          st.tx = 0;
          st.ty = 0;
        }
        // Critically damped enough to settle without overshooting into a wobble.
        st.x += (st.tx - st.x) * 0.12;
        st.y += (st.ty - st.y) * 0.12;
        node.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      // Starts hidden and is only revealed once the effect confirms a fine
      // pointer, so touch devices never paint it at all.
      className="pointer-events-none absolute inset-0 -z-10 hidden select-none overflow-hidden opacity-0 transition-opacity duration-1000 md:block"
    >
      {LETTERS.map((l, i) => (
        <span
          key={`${l.ch}-${i}`}
          data-letter
          className="display absolute text-white/[0.045] will-change-transform"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            fontSize: `calc(${l.s} * clamp(5rem, 13vw, 15rem))`,
            lineHeight: 0.8,
          }}
        >
          {l.ch}
        </span>
      ))}
    </div>
  );
}
