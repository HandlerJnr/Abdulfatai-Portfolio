import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

const facts = [
  {
    label: "Experience",
    value:
      "UI/UX Designer building responsive web and mobile products since 2023. At BIZINC I moved from intern to UI/UX Manager, leading other designers and interns; at Kremor AI I designed the platform end to end on contract; at ITSS I joined the Vista banking programme as an intern and moved onto staff.",
  },
  {
    label: "Sectors",
    value:
      "Healthcare, fintech, SaaS, AI, Web3, e-commerce and booking platforms — including complex dashboards and multi-step digital journeys.",
  },
  {
    label: "Research",
    value:
      "User interviews, usability testing, journey mapping, information architecture, UX benchmarking and research synthesis, with accessibility (WCAG) in mind.",
  },
  {
    label: "Collaboration",
    value:
      "Translating stakeholder requirements into practical improvements and working with developers through implementation, with working knowledge of HTML/CSS.",
  },
  {
    label: "Brighton",
    value:
      "Based in Brighton, UK. MSc User Experience Design at the University of Brighton from September 2026, seeking a part-time UI/UX or product design role alongside study.",
  },
  {
    label: "Recognition",
    value:
      "Best Intern Award (ITSS / Vista) and Top 10 Finalist, Synergy Africa Design Quest 2023. Written reference from the CEO of Bizinc available on request.",
  },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-16 border-t border-line/60 px-5 py-24 md:px-10 md:py-40"
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">About</span>
          <h2
            id="about-heading"
            className="display mt-6 text-[clamp(2.8rem,6vw,6.5rem)]"
          >
            <RevealLines lines={["Making complicated", "things feel simple"]} />
          </h2>
          <Reveal delay={0.2} className="mt-8">
            <p className="max-w-[40ch] text-[clamp(1.05rem,1.3vw,1.35rem)] leading-relaxed text-white/80">
              I design digital products that make complicated things feel
              simple. My work sits between user needs, business goals,
              technology, and visual clarity.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <a href={site.cv} download className="display link-line text-2xl tracking-wide">
              Download CV
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="display link-line text-2xl tracking-wide"
            >
              LinkedIn ↗
            </a>
            <a
              href={site.behance}
              target="_blank"
              rel="noreferrer"
              className="display link-line text-2xl tracking-wide"
            >
              Behance ↗
            </a>
          </Reveal>
        </div>

        <dl className="lg:col-span-6 lg:col-start-7">
          {facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.06}
              className="grid gap-2 border-t border-line/60 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <dt className="eyebrow pt-1">{f.label}</dt>
              <dd className="leading-relaxed text-white/75">{f.value}</dd>
            </Reveal>
          ))}
          <div className="border-t border-line/60" />
        </dl>
      </div>
    </section>
  );
}
