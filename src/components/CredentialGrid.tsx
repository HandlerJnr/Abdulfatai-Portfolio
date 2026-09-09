"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Credential } from "@/data/credentials";
import { Reveal } from "./Reveal";
import sizes from "@/data/imageSizes.json";

const dim = (src: string) =>
  (sizes as Record<string, { w: number; h: number }>)[src];

const isPdf = (path: string) => path.toLowerCase().endsWith(".pdf");

/**
 * Certificate cards that open the document itself in a lightbox. Previews are
 * flattened images so every card renders the same way regardless of whether the
 * source is a PDF or a JPEG; the lightbox then offers the real file.
 */
export function CredentialGrid({ items }: { items: Credential[] }) {
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
              className="group flex h-full w-full flex-col rounded-sm border border-line/60 bg-white/[0.015] text-left transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.04] focus-visible:border-accent"
              aria-label={`View ${c.title}, ${c.issuer}`}
            >
              <div className="relative overflow-hidden rounded-t-sm border-b border-line/60 bg-[#0b0b14]">
                <div className="flex h-56 items-center justify-center p-4 md:h-64">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.preview}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={dim(c.preview)?.w}
                    height={dim(c.preview)?.h}
                    className="max-h-full w-auto max-w-full object-contain shadow-[0_18px_40px_-18px_rgba(0,0,0,.9)] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-ink/70 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                  {isPdf(c.file) ? "PDF" : "Image"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                {/* What a recruiter should take from this document, in one line. */}
                {c.proves && (
                  <p className="text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-accent/90">
                    {c.proves}
                  </p>
                )}
                <h3 className="text-[0.975rem] font-medium leading-snug text-white">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{c.issuer}</p>
                {c.note && (
                  <p className="text-sm leading-relaxed text-white/45">{c.note}</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <span className="eyebrow">{c.date}</span>
                  <span className="eyebrow !text-white/45 transition-colors group-hover:!text-accent">
                    View →
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
            className="fixed inset-0 z-[95] flex flex-col bg-ink/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35 }}
            onClick={close}
          >
            <div className="flex items-start justify-between gap-6 border-b border-line/60 px-5 py-4 md:px-10">
              <div>
                <h2 className="display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none">
                  {open.title}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  {open.issuer} · {open.date}
                  {open.ref ? ` · ${open.ref}` : ""}
                </p>
                {open.proves && (
                  <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.14em] text-accent/90">
                    {open.proves}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={open.preview}
                alt={`${open.title} — ${open.issuer}`}
                className="max-h-full w-auto max-w-full rounded-sm bg-white object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
              />
            </div>

            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line/60 px-5 py-4 md:px-10"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={open.file}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="link-line eyebrow !text-white"
              >
                Open the {isPdf(open.file) ? "PDF" : "full image"} ↗
              </a>
              {open.verifyUrl && (
                <a
                  href={open.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="link-line eyebrow !text-white/70"
                >
                  Verify with the issuer ↗
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
