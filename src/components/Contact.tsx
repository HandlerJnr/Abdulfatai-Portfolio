import { Marquee } from "./Marquee";
import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 bg-paper text-ink"
    >
      <div className="px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-40">
        <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-ink/55">
          Contact
        </span>
        <h2
          id="contact-heading"
          className="display mt-6 text-[clamp(3.6rem,13vw,15rem)] text-ink"
        >
          <RevealLines lines={["Let’s create", "value"]} />
        </h2>
        <Reveal delay={0.2} className="mt-10">
          <p className="max-w-[36ch] text-[clamp(1.1rem,1.6vw,1.6rem)] leading-snug text-ink/70">
            Have a product, problem, or opportunity worth discussing?
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-14 md:mt-20">
          <a
            href={`mailto:${site.email}?subject=Product%20design%20opportunity`}
            data-cursor="link"
            className="display link-line text-[clamp(2.6rem,9vw,9.5rem)] leading-none text-ink hover:text-accent transition-colors duration-500"
          >
            Get in touch
          </a>
          <p className="mt-6 text-sm text-ink/55">{site.email}</p>
        </Reveal>
      </div>
      <Marquee
        items={["HELLO", "BONJOUR", "CIAO"]}
        separator="—"
        duration={34}
        className="display border-t border-ink/15 py-4 text-[clamp(2rem,5vw,4.5rem)] text-ink/80 [&_.text-accent]:text-accent"
      />
    </section>
  );
}
