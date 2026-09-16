"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts a metric up when it scrolls into view.
 *
 * The final string is what renders on the server and what a reader without
 * JavaScript sees — the animation only ever replaces it after mount, so the
 * number is never missing and never wrong. Values that carry no digits
 * ("Multi-entity", "Gated") pass straight through.
 */
const parse = (value: string) => {
  const m = value.match(/^(\D*?)([\d,]+(?:\.\d+)?)([\s\S]*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  return { prefix, target, suffix, grouped: digits.includes(",") };
};

export function CountUp({
  value,
  className,
  duration = 1.1,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  // Memoised: an object rebuilt each render would retrigger the effect on
  // every animation frame, restarting the count forever.
  const parsed = useMemo(() => parse(value), [value]);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!parsed || reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    // Same easing curve as every other transition on the site.
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const n = Math.round(parsed.target * ease(t));
      setShown(
        parsed.prefix +
          (parsed.grouped ? n.toLocaleString("en-GB") : String(n)) +
          parsed.suffix,
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed, reduce, duration]);

  // Reserve the final width so the layout cannot shift as digits grow.
  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="invisible block h-0 overflow-hidden">
        {value}
      </span>
      <span>{parsed && !reduce ? shown : value}</span>
    </span>
  );
}
