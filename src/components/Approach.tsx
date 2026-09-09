import { Reveal, RevealLines } from "./Reveal";
import { site } from "@/data/site";

/** The working process, stated as steps rather than as beliefs. */
const steps = [
  ["Frame the real problem", "Before anything is drawn, what is actually going wrong and for whom."],
  ["Map users, roles and constraints", "Who acts, what they are allowed to do, and what the business and regulator require."],
  ["Explore multiple directions", "More than one answer, held against each other rather than defended."],
  ["Prototype the riskiest assumption", "Build the part most likely to be wrong first, not the part easiest to draw."],
  ["Test clarity and usability", "Whether people understand it, not whether they like it."],
  ["Build reusable systems", "Components, variants and tokens, so the tenth screen costs less than the first."],
  ["Collaborate closely with engineering", "Handoff specs, front-end review, and design decisions that survive implementation."],
  ["Measure what changed", "And say plainly which numbers are mine and which belong to the business."],
];

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="border-t border-line/60 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">How I work</span>
          <h2
            id="approach-heading"
            className="display mt-6 text-[clamp(2.6rem,5.5vw,5.5rem)]"
          >
            <RevealLines lines={["From problem", "to shipped"]} />
          </h2>
          <Reveal delay={0.2} className="mt-8">
            <p className="max-w-[42ch] leading-relaxed text-white/70">
              The same eight steps run through every project on this site, from
              a four-market banking app to a single reporting dashboard.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-10">
            <a
              href={site.cv}
              download
              data-cursor="link"
              className="display link-line text-[clamp(1.5rem,2.4vw,2.2rem)] tracking-wide"
            >
              Download my CV
            </a>
          </Reveal>
        </div>

        <ol className="border-t border-line/60 lg:col-span-6 lg:col-start-7">
          {steps.map(([title, body], i) => (
            <Reveal
              as="li"
              key={title}
              delay={(i % 4) * 0.05}
              y={20}
              className="grid gap-2 border-b border-line/60 py-5 sm:grid-cols-[3rem_1fr] sm:gap-6"
            >
              <span className="display text-lg text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[0.975rem] font-medium text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
