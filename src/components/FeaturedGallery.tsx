"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { featuredProjects } from "@/data/projects";
import { ProjectArt } from "./ProjectArt";
import { Reveal } from "./Reveal";

export function FeaturedGallery() {
  const reduce = useReducedMotion();
  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="border-t border-line/60 py-20 md:py-28"
    >
      <div className="mb-10 flex items-end justify-between px-5 md:px-10">
        <Reveal>
          <h2 id="featured-heading" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
            Featured <span className="text-white/40">Work</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/#work" className="link-line eyebrow !text-white/80">
            All projects
          </Link>
        </Reveal>
      </div>

      <ul
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:gap-8 md:px-10"
        aria-label="Featured projects"
      >
        {featuredProjects.map((p, i) => (
          <motion.li
            key={p.slug}
            className="w-[82vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[40vw]"
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/work/${p.slug}`}
              data-cursor="view"
              className="group block focus-visible:outline-accent"
              aria-label={`${p.title} — ${p.category}. View case study`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line/60 bg-[#0b0b14]">
                <div className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]">
                  <ProjectArt project={p} />
                </div>
                <span className="display pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/40 bg-ink/60 px-4 py-2 text-sm tracking-[0.2em] text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:translate-y-2 md:group-hover:translate-y-0">
                  View case study →
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6 border-b border-line/60 pb-5">
                <div>
                  <h3 className="display text-[clamp(1.9rem,3vw,3rem)] leading-none">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">{p.category}</p>
                  <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/70">
                    {p.tagline}
                  </p>
                </div>
                <span className="eyebrow shrink-0 pt-2">{p.year}</span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
