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

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center md:px-10">
        <Reveal delay={0.1}>
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {site.title}
          </p>
        </Reveal>
        <h1
          id="hero-heading"
          className="display max-w-[16ch] text-[clamp(3.4rem,11.5vw,12.5rem)]"
        >
          <RevealLines lines={["You’ve come to", "the right", "product designer"]} />
        </h1>
        <Reveal delay={0.5} className="mt-10 max-w-[44ch]">
          <p className="text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed text-white/70">
            I’m Abdulfatai Jamiu — a UI/UX Product Designer and Researcher
            creating clear, useful digital experiences for complex products
            across healthcare, fintech, SaaS, AI, and booking platforms.
          </p>
        </Reveal>
        <Reveal delay={0.7} className="mt-8">
          <p className="eyebrow flex items-center gap-3">
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
