import Link from "next/link";
import { Reveal, RevealLines } from "./Reveal";

/**
 * The strongest four results on the site, each linking to the case study that
 * evidences it. Labelled by kind so design impact and product scope are never
 * conflated.
 */
const outcomes = [
  {
    value: "+45%",
    label: "User activation on the dashboard I designed",
    project: "Bizinc",
    href: "/work/bizinc",
    kind: "Design impact",
  },
  {
    value: "+23%",
    label: "Customer growth across the redesign period",
    project: "Bizinc",
    href: "/work/bizinc",
    kind: "Company-reported",
  },
  {
    value: "3x",
    label: "Improvement in partnership discovery and onboarding",
    project: "Synqit",
    href: "/work/synqit",
    kind: "Design impact",
  },
  {
    value: "4 markets",
    label: "One banking product across four West African subsidiaries",
    project: "Vista Digital Banking",
    href: "/work/vista-itss",
    kind: "Product scope",
  },
];

export function Outcomes() {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="scroll-mt-16 border-t border-line/60 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">Selected outcomes</span>
          <h2
            id="outcomes-heading"
            className="display mt-6 text-[clamp(2.6rem,5.5vw,5.5rem)]"
          >
            <RevealLines lines={["What the work", "changed"]} />
          </h2>
          <Reveal delay={0.2} className="mt-8">
            <p className="max-w-[46ch] leading-relaxed text-white/70">
              I design from problem framing to shipped interface: research,
              structure, interaction design, systems, prototyping and developer
              collaboration.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {outcomes.map((o, i) => (
            <Reveal as="li" key={o.label} delay={i * 0.07} y={24}>
              <Link
                href={o.href}
                data-cursor="view"
                className="group block h-full rounded-sm border border-line/60 bg-white/[0.015] p-6 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.04]"
              >
                <span
                  className={`text-[0.625rem] uppercase tracking-[0.16em] ${
                    o.kind === "Design impact" ? "text-accent/90" : "text-white/40"
                  }`}
                >
                  {o.kind}
                </span>
                <p className="display mt-3 text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none">
                  {o.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {o.label}
                </p>
                <span className="eyebrow mt-5 block !text-white/45 transition-colors group-hover:!text-accent">
                  {o.project} →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
