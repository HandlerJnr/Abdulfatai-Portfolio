import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal, RevealLines } from "@/components/Reveal";
import { site } from "@/data/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.category} | ${site.name}`,
    description: p.tagline,
  };
}

export default async function CaseStudy({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-[72px]">
      {/* Header */}
      <header className="border-b border-line/60 px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24">
        <Reveal>
          <Link href="/#work" className="link-line eyebrow !text-white/70">
            ← All work
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              {String(index + 1).padStart(2, "0")} — {project.category}
            </p>
            <h1 className="display mt-6 text-[clamp(3.6rem,12vw,13rem)]">
              <RevealLines lines={[project.title]} />
            </h1>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
              {project.tagline}
            </p>
          </Reveal>
        </div>
      </header>

      {/* Meta strip */}
      <dl className="grid border-b border-line/60 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Role", project.role],
          ["Year", project.year],
          ["Focus", project.tags.join(", ")],
          ["Status", project.status ?? "Case study"],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-line/60 px-5 py-6 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0 md:px-10">
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-white/80">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Hero art */}
      <Reveal className="px-5 py-10 md:px-10 md:py-16" y={48}>
        <div className="aspect-[16/9] overflow-hidden rounded-sm border border-line/60">
          <ProjectCover project={project} size="hero" priority />
        </div>
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className="link-line display mt-8 inline-block text-[clamp(1.4rem,2.4vw,2.2rem)] tracking-wide"
          >
            {project.externalLabel
              ? `Visit ${project.externalLabel} ↗`
              : "View the full project on Behance ↗"}
          </a>
        )}
      </Reveal>

      {/* Body */}
      <div className="grid gap-16 px-5 pb-24 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">Overview</h2>
            <p className="mt-6 leading-relaxed text-white/75">{project.overview}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">Deliverables</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.deliverables.map((d) => (
                <li key={d} className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/70">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {project.caseStudy ? (
            <>
              <Reveal>
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                  The challenge
                </h2>
                <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                  {project.challenge}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-16">
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">Process</h2>
                <ol className="mt-8 border-t border-line/60">
                  {project.process?.map((step, i) => (
                    <li
                      key={i}
                      className="grid gap-3 border-b border-line/60 py-6 sm:grid-cols-[4rem_1fr]"
                    >
                      <span className="display text-2xl text-accent">0{i + 1}</span>
                      <p className="leading-relaxed text-white/80">{step}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={0.1} className="mt-16">
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">Outcome</h2>
                <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                  {project.outcome}
                </p>
              </Reveal>
            </>
          ) : (
            <Reveal>
              <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                The full presentation
              </h2>
              <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                Screens, flows and the visual system for this project are
                published in full on Behance — including the work that sits
                behind the cover shown here.
              </p>
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="link-line display mt-10 inline-block text-[clamp(1.8rem,3.4vw,3.2rem)] tracking-wide"
                >
                  Open {project.title} on Behance ↗
                </a>
              )}
            </Reveal>
          )}
        </div>
      </div>

      {/* Additional imagery */}
      {project.gallery?.length ? (
        <section
          aria-label={`More images from ${project.title}`}
          className="border-t border-line/60 px-5 py-16 md:px-10 md:py-24"
        >
          <ul className="grid gap-6 md:gap-10">
            {project.gallery.map((img) => (
              <Reveal as="li" key={img.src} y={48}>
                <figure>
                  <div
                    className={`overflow-hidden rounded-sm border border-line/60 bg-[#05050C] ${
                      img.portrait ? "mx-auto w-fit max-w-[22rem]" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="block w-full"
                    />
                  </div>
                  <figcaption className="mt-4 max-w-[70ch] text-sm leading-relaxed text-white/55">
                    {img.alt}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor="view"
        className="group block border-t border-line/60 px-5 py-16 transition-colors hover:bg-white/[0.025] md:px-10 md:py-24"
      >
        <span className="eyebrow">Next project</span>
        <span className="display mt-4 block text-[clamp(3rem,9vw,10rem)] leading-[0.9] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-4">
          {next.title} →
        </span>
        <span className="mt-3 block text-white/60">{next.category}</span>
      </Link>
    </article>
  );
}
