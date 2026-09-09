import { Marquee } from "./Marquee";
import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

const columns = [
  {
    title: "Complex workflows",
    body:
      "Multi-step, multi-role journeys where the hard part is structure, not surface: approval chains, operational dashboards, and products where getting the order of steps wrong is the whole failure.",
  },
  {
    title: "Fintech & trust",
    body:
      "Money moving between people, currencies, entities and regulators. Disclosure before commitment, constraints surfaced early, and interfaces that stay clear without making risk feel smaller than it is.",
  },
  {
    title: "AI product design",
    body:
      "Generative and agent-based products where the design problem is calibrated trust: confidence signals, human review checkpoints, and scaffolding for people who cannot yet describe what they want.",
  },
  {
    title: "Multi-role & multi-market",
    body:
      "Permissions matrices, role-based operations, audit trails, and one design system holding across four subsidiaries with different languages, currencies and regulatory copy.",
  },
  {
    title: "Research to design",
    body:
      "Interviews, personas, journey mapping and usability testing translated into structural decisions — and stated honestly when a project was product-design-led rather than research-led.",
  },
  {
    title: "Design systems & handoff",
    body:
      "Auto Layout, components, variants and tokens; versioned files with a development-ready page; HTML and CSS literacy enough to review front-end builds against the designs.",
  },
];


export function Expertise() {
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="pt-24 md:pt-40"
    >
      <div className="px-5 md:px-10">
        <h2
          id="expertise-heading"
          className="display max-w-[12ch] text-[clamp(3rem,9vw,10rem)]"
        >
          <RevealLines lines={["What I bring"]} />
        </h2>
      </div>

      <div className="mt-16 grid border-t border-line/60 md:mt-24 md:grid-cols-3">
        {columns.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 0.12}
            className="border-b border-line/60 px-5 py-10 md:border-r md:px-10 md:py-14 md:[&:nth-child(3n)]:border-r-0"
          >
            <span className="eyebrow">0{i + 1}</span>
            <h3 className="display mt-6 text-[clamp(2rem,3.2vw,3.2rem)] leading-none">
              {c.title}
            </h3>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-white/65">
              {c.body}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 space-y-2 border-y border-line/60 py-4 md:mt-24">
        <Marquee
          items={site.skillsStrip}
          separator="—"
          duration={46}
          className="display text-[clamp(1.4rem,2.6vw,2.4rem)] text-white/70"
        />
        <Marquee
          items={site.skillsStrip}
          separator="—"
          duration={52}
          reverse
          className="display text-[clamp(1.4rem,2.6vw,2.4rem)] text-white/30"
        />
      </div>
    </section>
  );
}
