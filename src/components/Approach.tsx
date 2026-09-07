import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="border-t border-line/60 px-5 py-24 md:px-10 md:py-40"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2
            id="approach-heading"
            className="display text-[clamp(3rem,9vw,10rem)]"
          >
            <RevealLines lines={["Design with clarity.", "Build with purpose."]} />
          </h2>
        </div>
        <div className="lg:col-span-4 lg:col-start-8 lg:mt-6">
          <Reveal delay={0.2}>
            <p className="text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-white/70">
              I believe good product design is not only about visual polish. It
              is about understanding people, reducing friction, making complex
              systems easier to use, and creating digital products that remain
              useful long after launch. My process combines research, structure,
              interaction design, visual systems, prototyping, testing, and close
              collaboration with developers and stakeholders.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-12">
            <a
              href={site.cv}
              download
              data-cursor="link"
              className="display link-line text-[clamp(1.8rem,3vw,2.8rem)] tracking-wide"
            >
              Download my CV
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
