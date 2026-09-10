import type { Metadata } from "next";
import Link from "next/link";
import { systemGroups, systemCount } from "@/data/system";
import { SystemGrid } from "@/components/SystemGrid";
import { Reveal, RevealLines } from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Design systems — ${site.name}`,
  description:
    "How Abdulfatai Jamiu builds and documents design systems: colour ramps and semantic tokens, components documented as full state matrices, and the systems set up inside Bizinc, Chalant AI and Shortlet Lagos — including front-end handoff documentation.",
  alternates: { canonical: "/system" },
  openGraph: {
    title: "Design systems — Abdulfatai Jamiu",
    description:
      "Tokens, component state matrices, and systems built inside real products.",
    type: "article",
    url: "/system",
    images: [{ url: "/system/button-group.jpg", alt: "Button group component sheet" }],
  },
};

/** The argument the page makes, stated once at the top. */
const principles = [
  {
    head: "A component is a matrix, not a picture",
    body: "Every state crossed with every size, drawn rather than described. If a developer has to ask what the disabled state looks like at the medium size, the sheet has failed.",
  },
  {
    head: "Tokens carry meaning, not appearance",
    body: "Colour is published as Brand, Neutral, Error, Warning and Success on a numeric scale — so a rebrand is a token change, and nobody has to remember which blue was the right blue.",
  },
  {
    head: "The system ends at the handoff",
    body: "Sheets are only half of it. The other half is written documentation — interaction specs, empty and error states, responsive behaviour — so what ships is what was designed.",
  },
];

export default function SystemPage() {
  return (
    <article className="pt-[72px]">
      <header className="border-b border-line/60 px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24">
        <Reveal>
          <Link href="/" className="link-line eyebrow !text-white/70">
            ← Back home
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">{systemCount} sheets — open any of them</p>
            <h1 className="display mt-6 text-[clamp(3rem,9vw,9rem)]">
              <RevealLines lines={["Design", "systems"]} />
            </h1>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
              A library I designed and published on Figma, and the systems I set
              up inside client products. The point of both is the same: fewer
              decisions made twice, and a build that matches the design.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line/60 md:mt-20 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.head} className="bg-ink p-6 md:p-8">
              <h2 className="display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-tight">
                {p.head}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {p.body}
              </p>
            </div>
          ))}
        </Reveal>
      </header>

      <div className="px-5 pb-24 md:px-10">
        {systemGroups.map((group, gi) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className={`scroll-mt-24 ${gi === 0 ? "pt-14 md:pt-20" : "pt-16 md:pt-24"}`}
          >
            <div className="mb-8 border-t border-line/60 pt-8 md:mb-12">
              <Reveal>
                <h2
                  id={`${group.id}-heading`}
                  className="display text-[clamp(2rem,4vw,3.6rem)] leading-none"
                >
                  {group.title}
                </h2>
                <p className="mt-4 max-w-[68ch] leading-relaxed text-white/60">
                  {group.blurb}
                </p>
              </Reveal>
            </div>
            <SystemGrid items={group.items} />
          </section>
        ))}
      </div>

      <section className="border-t border-line/60 px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none">
            See it in the products
          </h2>
          <p className="mt-6 max-w-[62ch] leading-relaxed text-white/70">
            These systems exist because products needed them. The case studies
            show what they were built for.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <Link
              href="/work/bizinc"
              data-cursor="link"
              className="link-line display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-wide"
            >
              Bizinc →
            </Link>
            <Link
              href="/work/chalant-ai"
              data-cursor="link"
              className="link-line display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-wide !text-white/70"
            >
              Chalant AI →
            </Link>
            <Link
              href="/work/shortlet-lagos"
              data-cursor="link"
              className="link-line display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-wide !text-white/70"
            >
              Shortlet Lagos →
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
