"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Credential } from "@/data/credentials";
import { Reveal } from "./Reveal";
import sizes from "@/data/imageSizes.json";

const dim = (src: string) =>
  (sizes as Record<string, { w: number; h: number }>)[src];

const isPdf = (path: string) => path.toLowerCase().endsWith(".pdf");

export function CredentialGrid_V2({ items }: { items: Credential[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Credential | null>(null);

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
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={(i % 3) * 0.06} y={24}>
            <button
              type="button"
              onClick={() => setOpen(c)}
              data-cursor="view"
              className="group flex h-full w-full flex-col rounded-sm border border-line/60 bg-white/[0.01] text-left transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04] focus-visible:border-accent"
              aria-label={`View ${c.title}, ${c.issuer}`}
            >
              <div className="relative overflow-hidden rounded-t-sm border-b border-line/60 bg-[#0b0b14]">
                <div className="flex h-56 items-center justify-center p-4 md:h-64">
                  <img
                    src={c.preview}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={dim(c.preview)?.w}
                    height={dim(c.preview)?.h}
                    className="max-h-full w-auto max-w-full object-contain shadow-[0_18px_40px_-18px_rgba(0,0,0,.9)] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="absolute right-3 top-3 flex gap-2">
                  <span className="rounded-sm border border-white/20 bg-ink/80 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white/60 backdrop-blur">
                    {isPdf(c.file) ? "PDF Document" : "Image Asset"}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span className="text-[10px] uppercase tracking-widest text-accent/90 font-mono">
                    {c.proves || "Credential"}
                  </span>
                </div>
                <h3 className="text-[1rem] font-medium leading-snug text-white group-hover:text-accent transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">{c.issuer}</p>
                {c.note && (
                  <p className="text-xs leading-relaxed text-white/30 italic">{c.note}</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-line/30">
                  <span className="font-mono text-[10px] text-white/30">{c.date}</span>
                  <span className="eyebrow !text-white/40 transition-colors group-hover:!text-accent">
                    Verify →
                  </span>
                </div>
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
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent/70">Verified Document</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{open.slug}</span>
                </div>
                <h2 className="display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none">
                  {open.title}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  {open.issuer} · {open.date}
                  {open.ref ? ` · ${open.ref}` : ""}
                </p>
                {open.proves && (
                  <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.14em] text-accent/90 font-medium">
                    Verified Claim: {open.proves}
                  </p>
                )}
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
              className="flex flex-1 items-center justify-center overflow-auto p-5 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={open.preview}
                alt={`${open.title} — ${open.issuer}`}
                className="max-h-full w-auto max-w-full rounded-sm bg-white object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
              />
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-line/60 px-5 py-4 md:px-10 bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={open.file}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="link-line eyebrow !text-white font-bold"
              >
                Open Original {isPdf(open.file) ? "PDF" : "Asset"} ↗
              </a>
              {open.verifyUrl && (
                <a
                  href={open.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="link-line eyebrow !text-white/70"
                >
                  Verify with Issuer ↗
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
