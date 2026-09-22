"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { otherProjects } from "@/data/projects";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

export function SelectedWorks_V2() {
  const reduce = useReducedMotion();
  if (!otherProjects.length) return null;

  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-16 bg-zinc-950">
      <Marquee
        items={["PROJECT ARCHIVE", "PROJECT ARCHIVE", "PROJECT ARCHIVE"]}
        separator="—"
        duration={30}
        className="display border-y border-line/60 py-4 text-[clamp(2.4rem,7vw,7rem)] text-white/80"
        ariaLabel="More work"
      />

      <div className="px-5 pt-16 md:px-10 md:pt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal>
            <h2 id="work-heading" className="display text-[clamp(2.8rem,6vw,5rem)] leading-none">
              The Index
            </h2>
            <p className="mt-6 max-w-[42ch] text-[clamp(1.1rem,1.6vw,1.6rem)] leading-snug text-white/60">
              Beyond the featured work — a registry of case studies, 
              prototypes, and design explorations published in full.
            </p>
          </Reveal>
          <div className="hidden md:block text-right font-mono text-[10px] uppercase tracking-widest text-white/30">
            Total Entries: {otherProjects.length}
          </div>
        </div>
      </div>

      <ol className="mt-14 border-t border-line/60 md:mt-20">
        {otherProjects.map((p, i) => (
          <motion.li
            key={p.slug}
            className="border-b border-line/60 group"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/work/${p.slug}`}
              data-cursor="view"
              className="grid gap-4 px-5 py-8 transition-all duration-500 hover:bg-white/[0.02] focus-visible:bg-white/[0.04] md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-12"
            >
              <span className="font-mono text-[10px] uppercase tracking-tighter text-white/30 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              
              <span className="md:col-span-5">
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[9px] uppercase tracking-widest text-accent/70 font-mono px-1.5 py-0.5 border border-accent/30 rounded">
                    {p.productStatus || "Project"}
                  </span>
                </div>
                <span className="display block text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.9] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3">
                  {p.title}
                </span>
                <span className="mt-2 block text-sm text-white/50 md:text-base font-medium">
                  {p.category}
                </span>
              </span>

              <span className="text-sm leading-relaxed text-white/50 md:col-span-4">
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
                {p.externalUrl && (
                  <span className="text-xs uppercase tracking-[0.16em] text-white/30 font-mono">
                    {p.externalLabel ? `Source: ${p.externalLabel}` : "Source: Behance"}
                  </span>
                )}
              </span>

              <span className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-6">
                <span className="font-mono text-[10px] text-white/30">{p.year}</span>
                <span
                  aria-hidden="true"
                  className="display text-sm tracking-[0.2em] text-white/40 transition-colors group-hover:text-accent"
                >
                  {p.caseStudy ? "Dossier →" : "Explore →"}
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
