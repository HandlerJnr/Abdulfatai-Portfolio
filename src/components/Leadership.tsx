import Link from "next/link";
import { Reveal, RevealLines } from "./Reveal";

/**
 * Lead-track evidence. Each item is first-person ownership anchored to a named
 * engagement, so a hiring manager reading for seniority does not have to infer
 * it from the case studies.
 */
const items = [
  {
    title: "Product strategy across teams",
    body:
      "At Bizinc I set the design direction with the founding team and held it across booking, e-commerce and SaaS surfaces that different people were building at the same time. At Kremor AI I shaped the direction across three connected surfaces — storefront, AI workspace and operations platform — so they read as one product rather than three.",
    proof: "Bizinc · Kremor AI",
    href: "/work/bizinc",
  },
  {
    title: "Prioritisation and roadmap decisions",
    body:
      "I decided what got designed and in what order: which surfaces shipped first, what was deferred, and what was cut. At Bizinc that ran from the Business Profile 2.0 requirements through a file versioned v1.2 → v2.0 → development-ready. At Kremor AI it meant sequencing the operational roles against what the build could actually support.",
    proof: "Bizinc · Kremor AI",
    href: "/work/kremor-ai",
  },
  {
    title: "Leading and mentoring designers",
    body:
      "I finished at Bizinc as UI/UX Manager, leading the junior design team — UI designers, UX designers, graphic designers and interns — and I led the design team at Kremor AI on the same terms. That meant assigning the work, reviewing it, setting the component standards everyone designed against, and being the person accountable for what shipped. Bizinc's CEO has written this down; the letter is on the credentials page.",
    proof: "Reference letter, Bizinc CEO",
    href: "/credentials#references",
  },
  {
    title: "Owning research, not just design",
    body:
      "I led the research as well as the design on both engagements: framing the problem, mapping the journeys, and — at Kremor AI — evaluating the AI itself across 96+ complex interaction tasks, so design decisions about confidence and human review were grounded in how the model actually behaved.",
    proof: "Kremor AI",
    href: "/work/kremor-ai",
  },
  {
    title: "Sustained post-launch measurement",
    body:
      "I stayed with Bizinc after the redesign shipped and kept working against what the business tracked — activation, customer-to-customer activity, profile creation and retention. The numbers on this site come from that period, not from a launch-week snapshot.",
    proof: "Bizinc, 2024 — 2026",
    href: "/work/bizinc",
  },
  {
    title: "Influencing senior stakeholders",
    body:
      "I worked directly with Bizinc's CEO and founding team and with Kremor AI's founder: presenting direction, defending decisions that were argued with, and translating business goals into a scope a small team could actually build.",
    proof: "Two founder-level references",
    href: "/credentials#references",
  },
];

export function Leadership() {
  return (
    <section
      id="leadership"
      aria-labelledby="leadership-heading"
      className="scroll-mt-16 border-t border-line/60 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="eyebrow">Leading the work</span>
          <h2
            id="leadership-heading"
            className="display mt-6 text-[clamp(2.6rem,5vw,5rem)]"
          >
            <RevealLines lines={["Beyond", "the pixels"]} />
          </h2>
          <Reveal delay={0.2} className="mt-8">
            <p className="max-w-[40ch] leading-relaxed text-white/70">
              At Bizinc and Kremor AI I led the product design and the research —
              deciding what to build and in what order, not only how it should
              look.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-sm bg-line/60 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={(i % 2) * 0.07} y={22}>
              <Link
                href={it.href}
                data-cursor="view"
                className="group flex h-full flex-col bg-ink p-6 transition-colors duration-500 hover:bg-white/[0.035]"
              >
                <h3 className="text-[0.975rem] font-medium leading-snug text-white">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {it.body}
                </p>
                <span className="eyebrow mt-auto block pt-5 !text-white/40 transition-colors group-hover:!text-accent">
                  {it.proof} →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
