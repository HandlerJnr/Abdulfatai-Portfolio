import Link from "next/link";
import { Marquee } from "./Marquee";
import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col justify-between pt-[72px]"
      aria-labelledby="hero-heading"
    >
      <Marquee
        items={[site.heroMarquee]}
        duration={38}
        className="display border-b border-line/60 py-3 text-[clamp(1.6rem,3.2vw,2.6rem)] text-white/90"
      />

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center md:px-10">
        <Reveal delay={0.1}>
          <p className="eyebrow mb-7 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {site.title}
          </p>
        </Reveal>

        {/* The headline states the work, not a claim about the designer. Sized
            so it holds two lines and leaves the proposition, the links and the
            availability above the fold at 1440×900. */}
        <h1
          id="hero-heading"
          className="display max-w-[31ch] text-[clamp(2.1rem,5.4vw,5.4rem)]"
        >
          <RevealLines
            lines={[
              "I design clearer experiences",
              "for complex digital products.",
            ]}
          />
        </h1>

        <Reveal delay={0.45} className="mt-8 max-w-[62ch]">
          <p className="text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed text-white/75">
            I&rsquo;m Abdulfatai Jamiu, a UI/UX Product Designer and Researcher
            working across multi-market fintech, marketplace platforms, AI
            product operations, and digital healthcare. I turn complex workflows
            into products people can understand, trust, and use.
          </p>
        </Reveal>

        <Reveal delay={0.55} className="mt-6 max-w-[70ch]">
          <p className="text-[0.8125rem] uppercase leading-relaxed tracking-[0.14em] text-white/45">
            Research-led product design · UX strategy · Interaction design ·
            Prototyping · Design systems
          </p>
        </Reveal>

        {/* Routes a scanning recruiter straight to the proof. */}
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
            className="display link-line text-[clamp(1.15rem,1.7vw,1.5rem)] tracking-wide !text-white/75"
          >
            Credentials
          </Link>
          <a
            href={site.cv}
            download
            data-cursor="link"
            className="display link-line text-[clamp(1.15rem,1.7vw,1.5rem)] tracking-wide !text-white/75"
          >
            Download CV
          </a>
        </Reveal>

        <Reveal delay={0.75} className="mt-8">
          <p className="eyebrow flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {site.availability}
          </p>
        </Reveal>
      </div>

      <div className="flex items-center justify-between border-t border-line/60 px-5 py-4 md:px-10">
        <span className="eyebrow">{site.location}</span>
        <a href="#featured" className="eyebrow link-line !text-white/80">
          Scroll to explore ↓
        </a>
        <span className="eyebrow hidden sm:inline">Portfolio 2026</span>
      </div>
    </section>
  );
}
