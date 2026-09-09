import type { Metadata } from "next";
import Link from "next/link";
import { brandGroups, brandDocCount, brandPageCount } from "@/data/brand";
import { BrandGrid } from "@/components/BrandGrid";
import { Reveal, RevealLines } from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Brand & identity — ${site.name}`,
  description:
    "Brand guidelines and branded collateral by Abdulfatai Jamiu — complete identity systems for Shortlet Lagos and Female Rise, and investor decks for Female Rise Capital, Coworthy Capital and Synqit. Every page readable in the browser.",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Brand & identity — Abdulfatai Jamiu",
    description:
      "Identity systems and branded collateral supporting a product design practice.",
    type: "article",
    url: "/brand",
    images: [{ url: "/brand/pages/female-rise-brand-guide/p01.jpg", alt: "Brand guideline pages" }],
  },
};

export default function BrandPage() {
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
            <p className="eyebrow">
              {brandDocCount} documents — {brandPageCount} pages
            </p>
            <h1 className="display mt-6 text-[clamp(3rem,9vw,9rem)]">
              <RevealLines lines={["Brand &", "identity"]} />
            </h1>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
              My brand and identity work supports my product design practice:
              it helps me build clearer systems, stronger product narratives and
              more consistent visual experiences. Product design is the centre
              of this portfolio — this is the supporting evidence.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="px-5 pb-24 md:px-10">
        {brandGroups.map((group, gi) => (
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
                <p className="mt-4 max-w-[64ch] leading-relaxed text-white/60">
                  {group.blurb}
                </p>
              </Reveal>
            </div>
            <BrandGrid items={group.items} />
          </section>
        ))}
      </div>

      <section className="border-t border-line/60 px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none">
            Back to the product work
          </h2>
          <p className="mt-6 max-w-[60ch] leading-relaxed text-white/70">
            Shortlet Lagos and Synqit are both full product case studies here —
            the identity and the interface were designed by the same hand.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <Link
              href="/#featured"
              data-cursor="link"
              className="link-line display text-[clamp(1.6rem,3vw,2.6rem)] tracking-wide"
            >
              All product work →
            </Link>
            <Link
              href="/work/shortlet-lagos"
              data-cursor="link"
              className="link-line display text-[clamp(1.6rem,3vw,2.6rem)] tracking-wide"
            >
              Shortlet Lagos →
            </Link>
            <Link
              href="/work/synqit"
              data-cursor="link"
              className="link-line display text-[clamp(1.6rem,3vw,2.6rem)] tracking-wide"
            >
              Synqit →
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
