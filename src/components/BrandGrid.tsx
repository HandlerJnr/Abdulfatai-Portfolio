"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { pageSrc, type BrandDoc } from "@/data/brand";
import { Reveal } from "./Reveal";

/**
 * Multi-page documents: a card per document, and a reader that pages through
 * pre-rendered JPEGs of the whole thing — arrow keys, prev/next, a counter —
 * with the original PDF one click away. Pre-rendering means the reader needs
 * no PDF engine in the browser and every page is a plain image request.
 */
export function BrandGrid({ items }: { items: BrandDoc[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<BrandDoc | null>(null);
  const [page, setPage] = useState(1);

  const close = useCallback(() => setOpen(null), []);
  const show = (doc: BrandDoc, at = 1) => {
    setPage(at);
    setOpen(doc);
  };

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setPage((p) => Math.min(open.pages, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Keep the neighbouring pages warm so paging never shows a blank frame.
  useEffect(() => {
    if (!open) return;
    [page + 1, page - 1]
      .filter((n) => n >= 1 && n <= open.pages)
      .forEach((n) => {
        const img = new Image();
        img.src = pageSrc(open.slug, n);
      });
  }, [open, page]);

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((d, i) => (
          <Reveal as="li" key={d.slug} delay={(i % 3) * 0.06} y={24}>
            <button
              type="button"
              onClick={() => show(d)}
              data-cursor="view"
              className="group flex h-full w-full flex-col rounded-sm border border-line/60 bg-white/[0.015] text-left transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.04] focus-visible:border-accent"
              aria-label={`Read ${d.title}, ${d.pages} pages`}
            >
              <div className="relative overflow-hidden rounded-t-sm border-b border-line/60 bg-[#0b0b14]">
                <div className="aspect-[16/9] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageSrc(d.slug, d.cover)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-ink/70 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                  {d.pages} pages
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                {d.proves && (
                  <p className="text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-accent/90">
                    {d.proves}
                  </p>
                )}
                <h3 className="text-[0.975rem] font-medium leading-snug text-white">
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">{d.note}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <span className="eyebrow">
                    {d.client}
                    {d.year ? ` · ${d.year}` : ""}
                  </span>
                  <span className="eyebrow !text-white/45 transition-colors group-hover:!text-accent">
                    Read →
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
            aria-label={`${open.title}, page ${page} of ${open.pages}`}
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
              <div>
                <h2 className="display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none">
                  {open.title}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  {open.client}
                  {open.year ? ` · ${open.year}` : ""} · {open.pages} pages
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

            <div
              className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-5 md:px-20 md:py-8"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={page}
                  src={pageSrc(open.slug, page)}
                  alt={`${open.title} — page ${page}`}
                  className="max-h-full w-auto max-w-full rounded-sm bg-white object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
                  initial={{ opacity: 0, x: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -12 }}
                  transition={{ duration: reduce ? 0.1 : 0.22 }}
                />
              </AnimatePresence>

              <PageButton
                dir="prev"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <PageButton
                dir="next"
                disabled={page >= open.pages}
                onClick={() => setPage((p) => Math.min(open.pages, p + 1))}
              />
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line/60 px-5 py-4 md:px-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <span className="eyebrow !text-white">
                  Page {page} <span className="text-white/40">/ {open.pages}</span>
                </span>
                <span className="eyebrow hidden !text-white/40 sm:inline">
                  ← → to turn pages
                </span>
              </div>
              <a
                href={open.file}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="link-line eyebrow !text-white"
              >
                Open the PDF ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PageButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/70 text-white backdrop-blur transition-colors hover:border-white disabled:cursor-default disabled:opacity-25 disabled:hover:border-line md:flex ${
        dir === "prev" ? "left-4" : "right-4"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        {dir === "prev" ? <path d="M10 3 5 8l5 5" /> : <path d="m6 3 5 5-5 5" />}
      </svg>
    </button>
  );
}
