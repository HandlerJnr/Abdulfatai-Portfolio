"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

export function SelectedWorks() {
  const reduce = useReducedMotion();
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-16">
      <Marquee
        items={["SELECTED WORK", "SELECTED WORK", "SELECTED WORK"]}
        separator="—"
        duration={30}
        className="display border-y border-line/60 py-4 text-[clamp(2.4rem,7vw,7rem)] text-white"
        ariaLabel="Selected work"
      />

      <div className="px-5 pt-16 md:px-10 md:pt-24">
        <Reveal>
          <h2 id="work-heading" className="sr-only">
            Selected work
          </h2>
          <p className="max-w-[40ch] text-[clamp(1.1rem,1.6vw,1.6rem)] leading-snug text-white/80">
            Selected work across healthcare, fintech, AI, SaaS, property, and
            digital services.
          </p>
        </Reveal>
      </div>

      <ol className="mt-14 border-t border-line/60 md:mt-20">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            className="border-b border-line/60"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/work/${p.slug}`}
              data-cursor="view"
              className="group grid gap-4 px-5 py-8 transition-colors duration-500 hover:bg-white/[0.025] focus-visible:bg-white/[0.04] md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-10"
            >
              <span className="eyebrow md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="md:col-span-5">
                <span className="display block text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.9] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3">
                  {p.title}
                </span>
                <span className="mt-2 block text-sm text-white/60 md:text-base">
                  {p.category}
                </span>
              </span>
              <span className="text-sm leading-relaxed text-white/55 md:col-span-4">
                {p.tags.join(", ")}
                {p.externalUrl && (
                  <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-white/35">
                    On Behance
                  </span>
                )}
              </span>
              <span className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-6">
                <span className="eyebrow">{p.year}</span>
                <span
                  aria-hidden="true"
                  className="display text-sm tracking-[0.2em] text-white/50 transition-colors group-hover:text-accent"
                >
                  {p.caseStudy ? "Case study →" : "View project →"}
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
