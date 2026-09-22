import Link from "next/link";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";
import { site } from "@/data/site";
import { Fragment } from "react";
import { NameField } from "./NameField";
import { RotatingWord } from "./RotatingWord";

export function Hero_V2() {
  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col justify-between pt-[72px] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <NameField />
      <Marquee
        items={[site.heroMarquee]}
        duration={38}
        className="display border-b border-line/60 py-3 text-[clamp(1.6rem,3.2vw,2.6rem)] text-white/90"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 text-center md:px-10">
        <Reveal delay={0.1}>
          <div className="mb-10 flex items-center gap-4 rounded-full border border-line/40 bg-white/[0.02] px-3 py-1 text-[10px] uppercase tracking-widest text-white/40 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
              System Active
            </span>
            <span className="opacity-30">|</span>
            <span>Ver 2.0.1</span>
            <span className="opacity-30">|</span>
            <span>{site.location}</span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="eyebrow mb-7 flex items-center justify-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Fintech · SaaS · AI · Marketplaces
          </p>
        </Reveal>

        <h1
          id="hero-heading"
          data-cursor="zoom"
          aria-label="I design clearer experiences for complex digital products."
          className="display max-w-[35ch] text-[clamp(2.1rem,5.4vw,5.4rem)] tracking-tight"
        >
          {[
            ["I design", "experiences"],
            ["for complex digital products."],
          ].map((parts, i) => (
            <span key={i} className="line-mask">
              <span
                className="line-rise"
                style={{ animationDelay: `${0.08 + i * 0.09}s` }}
              >
                {parts.map((part, pi) => (
                  <Fragment key={pi}>
                    {part.split(" ").map((word, w, words) => (
                      <Fragment key={`${word}-${w}`}>
                        <span className="word">
                          {[...word].map((ch, c) => (
                            <span key={c} className="letter">
                              {ch}
                            </span>
                          ))}
                        </span>
                        {w < words.length - 1 ? " " : null}
                      </Fragment>
                    ))}
                    {i === 0 && pi === 0 ? (
                      <>
                        {" "}
                        <span className="word">
                          <RotatingWord />
                        </span>{" "}
                      </>
                    ) : null}
                  </Fragment>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <Reveal delay={0.4} className="mt-7 max-w-[56ch]">
          <p className="text-[clamp(1.05rem,1.5vw,1.4rem)] leading-snug text-white/90 font-medium">
            Product Designer specialising in fintech, SaaS and AI products.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-5 max-w-[62ch]">
          <p className="text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed text-white/60">
            I&rsquo;m Abdulfatai Jamiu. I work across multi-market fintech,
            marketplace platforms, AI product operations and digital healthcare
            &mdash; research through to shipped interface. I turn complex
            workflows into products people can understand, trust, and use.
          </p>
        </Reveal>

        <Reveal delay={0.55} className="mt-6 max-w-[70ch]">
          <p className="text-[0.8125rem] uppercase leading-relaxed tracking-[0.18em] text-white/30 font-mono">
            Research-led product design · UX strategy · Interaction design ·
            Prototyping · Design systems
          </p>
        </Reveal>

        <Reveal
          delay={0.65}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          <Link
            href="/#featured"
            data-cursor="link"
            className="display link-line text-[clamp(1.15rem,1.7vw,1.5rem)] tracking-wide"
          >
            Selected work
          </Link>
          <Link
            href="/credentials"
            data-cursor="link"
            className="display link-line text-[clamp(1.15rem,1.7vw,1.5rem)] tracking-wide !text-white/60"
          >
            Credentials
          </Link>
          <a
            href={site.cv}
            download
            data-cursor="link"
            className="display link-line text-[clamp(1.15rem,1.7vw,1.5rem)] tracking-wide !text-white/60"
          >
            Download CV
          </a>
        </Reveal>

      </div>

      <div className="flex items-center justify-between border-t border-line/60 px-5 py-4 md:px-10 z-10 bg-black/50 backdrop-blur-sm">
        <span className="eyebrow font-mono">{site.location}</span>
        <a href="#featured" className="eyebrow link-line !text-white/80">
          Scroll to explore ↓
        </a>
        <span className="eyebrow hidden sm:inline font-mono">Portfolio 2026</span>
      </div>
    </section>
  );
}
