import { Reveal } from "./Reveal";

/**
 * Four facts, directly under the hero. Each states what kind of fact it is,
 * so a company traction figure is never read as a personal design result.
 */
const items = [
  { value: "4+ years", label: "Designing digital products", kind: "Experience" },
  { value: "+45%", label: "Dashboard activation at Bizinc", kind: "Design impact" },
  { value: "4 markets", label: "Multi-currency fintech at Vista", kind: "Product scope" },
  {
    value: "100K+",
    label: "International students using Radius — company-reported product traction",
    kind: "Company-reported",
  },
];

export function Credibility() {
  return (
    <section
      aria-label="Credibility at a glance"
      className="border-t border-line/60"
    >
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal
            as="li"
            key={it.label}
            delay={i * 0.06}
            y={20}
            className="border-b border-line/60 px-5 py-7 sm:border-r sm:[&:nth-child(2n)]:border-r-0 md:px-10 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
          >
            <span className="text-[0.625rem] uppercase tracking-[0.16em] text-white/40">
              {it.kind}
            </span>
            <p className="display mt-3 text-[clamp(1.9rem,3vw,2.6rem)] leading-none">
              {it.value}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{it.label}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
