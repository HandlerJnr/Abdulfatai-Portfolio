import type { Metadata } from "next";
import Link from "next/link";
import { systemGroups, systemCount } from "@/data/system";
import { SystemGrid_V2 } from "@/components/SystemGrid_V2";
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

export default function SystemPage_V2() {
  return (
    <article className="pt-[72px] bg-zinc-950">
      <header className="border-b border-line/60 px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24">
        <Reveal>
          <Link href="/" className="link-line eyebrow !text-white/70">
            ← Back home
          </Link>
        </Reveal>
        
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">System Registry Active</span>
            </div>
            <h1 className="display text-[clamp(3rem,9vw,9rem)] tracking-tight">
              <RevealLines lines={["Design", "systems"]} />
            </h1>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/60">
              A library of deterministic design patterns and systematic frameworks. 
              The point is simple: eliminate ambiguity, reduce redundant decisions, 
              and ensure the build matches the intent.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line/60 md:mt-20 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.head} className="bg-ink p-6 md:p-8 group transition-colors duration-500 hover:bg-white/[0.02]">
              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-accent/50">0{principles.indexOf(p)+1}</span>
                <h2 className="display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-tight">
                  {p.head}
                </h2>
              </div>
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
            <div className="mb-8 border-t border-line/60 pt-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Reveal>
                  <h2
                    id={`${group.id}-heading`}
                    className="display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-tight"
                  >
                    {group.title}
                  </h2>
                  <p className="mt-4 max-w-[68ch] leading-relaxed text-white/50">
                    {group.blurb}
                  </p>
                </Reveal>
              </div>
              <div className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-white/30">
                {group.items.length} sheets in registry
              </div>
            </div>
            <SystemGrid_V2 items={group.items} />
          </section>
        ))}
      </div>

      <section className="border-t border-line/60 px-5 py-16 md:px-10 md:py-24 bg-white/[0.01]">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-tight">
            Real-world application
          </h2>
          <p className="mt-6 max-w-[62ch] leading-relaxed text-white/60">
            These systems aren't theoretical; they are the operational backbone 
            of shipped products. The case studies demonstrate the transition 
            from token to interface.
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
              className="link-line display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-wide !text-white/60"
            >
              Chalant AI →
            </Link>
            <Link
              href="/work/shortlet-lagos"
              data-cursor="link"
              className="link-line display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-wide !text-white/60"
            >
              Shortlet Lagos →
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
