"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the overlay is open
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      const prev = root.style.overflow;
      root.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        root.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-ink/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4 md:px-10">
          <Link
            href="/"
            className="display text-2xl leading-none tracking-wide"
            aria-label={`${site.name} — home`}
          >
            AJ<span className="text-accent">.</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-line eyebrow !text-white/80 transition-colors hover:!text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <span className="eyebrow hidden lg:inline">{site.location}</span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-white"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 block h-px w-full bg-white transition-transform duration-500 ${
                    open ? "translate-y-[5.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-px w-full bg-white transition-transform duration-500 ${
                    open ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col justify-between gap-8 overflow-y-auto bg-ink px-5 pb-8 pt-24 md:px-10 md:pt-28"
            initial={{ opacity: 0, y: reduce ? 0 : "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : "-2%" }}
            transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-1 md:gap-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: reduce ? 0.2 : 0.8,
                      delay: 0.1 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display block text-[clamp(2.75rem,min(15vw,7.6vh),7rem)] leading-[0.92] text-white/90 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex flex-col gap-2">
                <span className="eyebrow">Get in touch</span>
                <a href={`mailto:${site.email}`} className="link-line text-lg">
                  {site.email}
                </a>
              </div>
              <div className="flex gap-6">
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="link-line eyebrow !text-white">
                  LinkedIn
                </a>
                <a href={site.behance} target="_blank" rel="noreferrer" className="link-line eyebrow !text-white">
                  Behance
                </a>
                <a href={site.cv} download className="link-line eyebrow !text-white">
                  Download CV
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
