import { Marquee } from "./Marquee";
import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

const columns = [
  {
    title: "Product Design",
    body:
      "User flows, wireframes, high-fidelity UI, responsive interfaces, interaction design, design systems, accessibility, developer handoff.",
  },
  {
    title: "Research and Strategy",
    body:
      "User research, usability testing, information architecture, quantitative analysis, problem framing, journey mapping, product discovery.",
  },
  {
    title: "Tools and Collaboration",
    body:
      "Figma, FigJam, Prototyping, Design Systems, Jira, Adobe tools, stakeholder communication, cross-functional collaboration.",
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
          <RevealLines lines={["What I bring", "to the table"]} />
        </h2>
      </div>

      <div className="mt-16 grid border-t border-line/60 md:mt-24 md:grid-cols-3">
        {columns.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 0.12}
            className="border-b border-line/60 px-5 py-10 md:border-b-0 md:border-r md:px-10 md:py-14 md:last:border-r-0"
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
