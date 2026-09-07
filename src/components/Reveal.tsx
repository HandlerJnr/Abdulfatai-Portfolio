"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "h1" | "h2" | "h3" | "span";
  once?: boolean;
  y?: number;
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  once = true,
  y = 32,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.9, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

/** Splits a heading into lines that reveal with a stagger. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  // The observer lives on the wrapper: each line starts translated fully out of
  // its own overflow-hidden mask, so observing the line itself never intersects.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: reduce ? 0.3 : 1,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
