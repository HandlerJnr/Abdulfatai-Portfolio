import type { Metadata } from "next";
import Link from "next/link";
import { credentialGroups, credentialCount } from "@/data/credentials";
import { CredentialGrid } from "@/components/CredentialGrid";
import { Reveal, RevealLines } from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Credentials — ${site.name}`,
  description:
    "References, awards and certifications for Abdulfatai Jamiu — including a written reference from the CEO of Bizinc and ITSS's Most Outstanding Intern of the Year for the Vista banking project. Every document can be opened and read in full.",
};

export default function CredentialsPage() {
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
            <p className="eyebrow">Verifiable — {credentialCount} documents</p>
            <h1 className="display mt-6 text-[clamp(3.2rem,10vw,10rem)]">
              <RevealLines lines={["Credentials"]} />
            </h1>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
              The references, awards and certifications behind the work — open
              any of them and read the document yourself rather than taking a
              line on a CV at face value.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="px-5 pb-24 md:px-10">
        {credentialGroups.map((group, gi) => (
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
                {group.blurb && (
                  <p className="mt-4 max-w-[62ch] leading-relaxed text-white/60">
                    {group.blurb}
                  </p>
                )}
              </Reveal>
            </div>
            <CredentialGrid items={group.items} />
          </section>
        ))}
      </div>

      <section className="border-t border-line/60 px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none">
            Anything else you need?
          </h2>
          <p className="mt-6 max-w-[60ch] leading-relaxed text-white/70">
            Referee contact details, the full CV, or a walkthrough of any project
            in this portfolio — just ask.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <a
              href={`mailto:${site.email}?subject=Reference%20request`}
              data-cursor="link"
              className="link-line display text-[clamp(1.6rem,3vw,2.6rem)] tracking-wide"
            >
              Get in touch ↗
            </a>
            <a
              href={site.cv}
              download
              data-cursor="link"
              className="link-line display text-[clamp(1.6rem,3vw,2.6rem)] tracking-wide !text-white/70"
            >
              Download CV
            </a>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
