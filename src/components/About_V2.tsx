import Link from "next/link";
import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

const facts = [
  {
    label: "Experience",
    value:
      "Product designer building responsive web and mobile products since 2022. At BIZINC I moved from intern to UI/UX Manager; at Kremor AI I led design and research across the platform end to end on contract; at ITSS I joined the Vista banking programme as an intern and moved onto staff.",
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
      "Based in Brighton, UK. MSc User Experience Design at the University of Brighton, September 2026 to 2028.",
  },
  {
    label: "Recognition",
    value:
      "Most Outstanding Intern of the Year (ITSS / Vista) and Finalist, Synergy Africa Design Quest 2023. Written references from the CEO of Bizinc and the founder of Kremor AI, the ITSS award letter and every certification can be read in full on the credentials page.",
  },
];

export function About_V2() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-16 border-t border-line/60 px-5 py-24 md:px-10 md:py-40 bg-zinc-950"
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">About</span>
          <h2
            id="about-heading"
            className="display mt-6 text-[clamp(2.8rem,6vw,6.5rem)] tracking-tight"
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
            <Link href="/system" className="display link-line text-2xl tracking-wide">
              Design systems
            </Link>
            <Link href="/credentials" className="display link-line text-2xl tracking-wide">
              Credentials
            </Link>
            <Link href="/brand" className="display link-line text-2xl tracking-wide">
              Brand work
            </Link>
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

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal className="mb-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                head: "Bizinc",
                body: "Designed the platform from scratch; progressed intern → Product Designer → UI/UX Manager. +45% dashboard activation.",
                href: "/work/bizinc",
                status: "Manager",
                impact: "+45%"
              },
              {
                head: "Vista",
                body: "Multi-currency banking across four West African subsidiaries, with client recognition naming the project.",
                href: "/work/vista-itss",
                status: "Staff",
                impact: "Global"
              },
              {
                head: "Kremor AI",
                body: "Three product surfaces, five operational roles, plus AI model evaluation across 96+ interaction tasks.",
                href: "/work/kremor-ai",
                status: "Contract",
                impact: "End-to-End"
              },
            ].map((p) => (
              <Link
                key={p.head}
                href={p.href}
                data-cursor="view"
                className="group relative rounded-sm border border-line/60 bg-white/[0.01] p-5 transition-all duration-500 hover:border-white/25 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.625rem] uppercase tracking-[0.16em] text-accent/90 font-mono">
                    Case File
                  </span>
                  <span className="text-[0.625rem] uppercase tracking-widest text-white/30 font-mono border border-white/10 px-1.5 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
                <h3 className="display text-[clamp(1.4rem,2vw,1.8rem)] leading-none mb-3">
                  {p.head}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {p.body}
                </p>
                <div className="mt-4 pt-4 border-t border-line/30 flex items-center justify-between">
                   <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Impact</span>
                   <span className="text-[10px] font-bold text-accent">{p.impact}</span>
                </div>
              </Link>
            ))}
          </Reveal>

          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
            
            <dl className="relative z-10">
              {facts.map((f, i) => (
                <Reveal
                  key={f.label}
                  delay={i * 0.06}
                  className="grid gap-2 border-t border-line/60 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8 group"
                >
                  <dt className="font-mono text-[0.75rem] uppercase tracking-wider text-white/40 pt-1 group-hover:text-accent transition-colors">
                    {f.label}
                  </dt>
                  <dd className="leading-relaxed text-white/70 text-sm">
                    {f.value}
                  </dd>
                </Reveal>
              ))}
              <div className="border-t border-line/60" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
