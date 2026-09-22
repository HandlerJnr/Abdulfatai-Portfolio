"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { systemSrc, type SystemItem } from "@/data/system";
import { Reveal } from "./Reveal";
import sizes from "@/data/imageSizes.json";

const dim = (src: string) =>
  (sizes as Record<string, { w: number; h: number }>)[src];

const spanClass: Record<NonNullable<SystemItem["span"]> | "default", string> = {
  hero: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  wide: "sm:col-span-2",
  tall: "lg:row-span-2",
  default: "",
};

export function SystemGrid_V2({ items }: { items: SystemItem[] }) {
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
              className="group flex h-full w-full flex-col overflow-hidden rounded-sm border border-line/60 bg-white/[0.01] text-left transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04] focus-visible:border-accent"
              aria-label={`View ${it.title}`}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f4f4f7]">
                <img
                  src={systemSrc(it.slug)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={dim(systemSrc(it.slug))?.w}
                  height={dim(systemSrc(it.slug))?.h}
                  className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                />
                {it.source === "figma" && (
                  <span className="pointer-events-none absolute right-2 top-2 rounded-sm border border-ink/10 bg-white/90 px-2 py-0.5 text-[9px] uppercase tracking-widest text-ink/60 backdrop-blur">
                    Figma
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-line/60 px-4 py-3 bg-zinc-950">
                <div className="flex flex-col">
                  <h3 className="text-[0.8125rem] font-medium leading-snug text-white group-hover:text-accent transition-colors">
                    {it.title}
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-1">
                    {it.slug}
                  </span>
                </div>
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
            className="fixed inset-0 z-[95] flex flex-col bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35 }}
            onClick={close}
          >
            <div
              className="flex items-start justify-between gap-6 border-b border-line/60 px-5 py-4 md:px-10 bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent/70">System Sheet</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{open.slug}</span>
                </div>
                <h2 className="display text-[clamp(1.3rem,2.4vw,2rem)] leading-none">
                  {open.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-full border border-line px-4 py-2 text-[0.6875rem] uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white hover:text-white"
              >
                Close
              </button>
            </div>

            <div
              className="flex-1 overflow-auto p-5 md:p-10 grid lg:grid-cols-12 gap-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lg:col-span-8">
                <img
                  src={systemSrc(open.slug)}
                  alt={open.title}
                  className="mx-auto w-auto max-w-full rounded-sm bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
                />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="border-l-2 border-accent/30 pl-6 py-2">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">RATIONALE</h4>
                  <p className="text-sm leading-relaxed text-white/70">
                    {open.note}
                  </p>
                </div>
                <div className="border-l-2 border-white/10 pl-6 py-2">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">SPECIFICATIONS</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-xs">
                      <span className="text-white/40">Source:</span>
                      <span className="text-white/80 font-mono uppercase">{open.source}</span>
                    </li>
                    <li className="flex justify-between text-xs">
                      <span className="text-white/40">Span:</span>
                      <span className="text-white/80 font-mono uppercase">{open.span || "Standard"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
