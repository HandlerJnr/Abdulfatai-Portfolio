"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { systemSrc, type SystemItem } from "@/data/system";
import { Reveal } from "./Reveal";
import sizes from "@/data/imageSizes.json";

const dim = (src: string) =>
  (sizes as Record<string, { w: number; h: number }>)[src];

/** Bento spans. Sheets that carry the most information get the most room. */
const spanClass: Record<NonNullable<SystemItem["span"]> | "default", string> = {
  hero: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  wide: "sm:col-span-2",
  tall: "lg:row-span-2",
  default: "",
};

/**
 * A bento grid of design-system sheets. Cards keep a consistent frame on the
 * dark ground — the sheets themselves are light artwork, so each sits on a
 * near-white plate rather than bleeding into the page.
 */
export function SystemGrid({ items }: { items: SystemItem[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<SystemItem | null>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <ul className="grid grid-flow-row-dense auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[14rem] lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal
            as="li"
            key={it.slug}
            delay={(i % 4) * 0.05}
            y={22}
            className={spanClass[it.span ?? "default"]}
          >
            <button
              type="button"
              onClick={() => setOpen(it)}
              data-cursor="view"
              className="group flex h-full w-full flex-col overflow-hidden rounded-sm border border-line/60 bg-white/[0.015] text-left transition-colors duration-500 hover:border-white/25 focus-visible:border-accent"
              aria-label={`View ${it.title}`}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f4f4f7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={systemSrc(it.slug)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={dim(systemSrc(it.slug))?.w}
                  height={dim(systemSrc(it.slug))?.h}
                  className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                />
                {it.source === "figma" && (
                  <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full border border-ink/15 bg-white/85 px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.16em] text-ink/60 backdrop-blur">
                    In Figma
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-line/60 px-4 py-3">
                <h3 className="text-[0.8125rem] font-medium leading-snug text-white">
                  {it.title}
                </h3>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-white/30 transition-colors group-hover:text-accent"
                >
                  ↗
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            className="fixed inset-0 z-[95] flex flex-col bg-ink/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35 }}
            onClick={close}
          >
            <div
              className="flex items-start justify-between gap-6 border-b border-line/60 px-5 py-4 md:px-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <h2 className="display text-[clamp(1.3rem,2.4vw,2rem)] leading-none">
                  {open.title}
                </h2>
                <p className="mt-2 max-w-[80ch] text-sm leading-relaxed text-white/60">
                  {open.note}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-full border border-line px-4 py-2 text-[0.6875rem] uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Long documents scroll rather than shrink to illegibility. */}
            <div
              className="flex-1 overflow-auto p-5 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={systemSrc(open.slug)}
                alt={open.title}
                className="mx-auto w-auto max-w-full rounded-sm bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
