import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal, RevealLines } from "@/components/Reveal";
import { site } from "@/data/site";
import sizes from "@/data/imageSizes.json";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.title} — ${p.category}`;
  // The overview is the honest description of the work; fall back to the
  // tagline for the two projects that lead with one.
  const description = `${p.tagline} ${p.overview}`.slice(0, 300).trim();
  const image = p.cover ?? "/og.jpg";
  const url = `/work/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      type: "article",
      url,
      images: [{ url: image, alt: `${p.title} — ${p.category}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image],
    },
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
          <Link href="/#featured" className="link-line eyebrow !text-white/70">
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
          ["Status", project.productStatus ?? project.status ?? "Case study"],
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

          {project.context && (
            <Reveal delay={0.1} className="mt-12">
              <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                At a glance
              </h2>
              <dl className="mt-6 border-t border-line/60">
                {(
                  [
                    ["Role", project.role],
                    ["Ownership", project.context.ownership],
                    ["Timeline", project.context.timeline],
                    ["Product status", project.productStatus],
                    ["Platform", project.context.platform],
                    ["Primary users", project.context.primaryUsers],
                    ["Main focus", project.context.focus],
                    ["Product", project.context.product],
                    ["Team", project.context.team],
                    ["Scope", project.context.scope],
                    ["Constraints", project.context.constraints],
                  ] as const
                )
                  .filter(([, v]) => Boolean(v))
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="grid gap-1 border-b border-line/60 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4"
                    >
                      <dt className="eyebrow pt-0.5">{k}</dt>
                      <dd className="text-sm leading-relaxed text-white/75">{v}</dd>
                    </div>
                  ))}
              </dl>
            </Reveal>
          )}

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
              {project.contribution && (
                <Reveal className="mb-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    My contribution
                  </h2>
                  <p className="mt-6 rounded-sm border border-line/60 bg-white/[0.025] p-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/85">
                    {project.contribution}
                  </p>
                </Reveal>
              )}

              <Reveal>
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                  The problem
                </h2>
                <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                  {project.challenge}
                </p>
              </Reveal>

              {project.difficulty && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    What made this hard
                  </h2>
                  <p className="mt-6 border-l-2 border-accent/70 pl-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                    {project.difficulty}
                  </p>
                </Reveal>
              )}

              {project.research && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    Research &amp; discovery
                  </h2>
                  <p className="eyebrow mt-6 !text-accent/90">
                    Research status — {project.research.status}
                  </p>
                  <dl className="mt-6 border-t border-line/60">
                    {(
                      [
                        ["Who", project.research.considered],
                        ["Investigated", project.research.investigated],
                        ["Learned", project.research.learned],
                        ["Changed", project.research.changed],
                        ["Still open", project.research.uncertain],
                        ["Next test", project.research.nextTest],
                      ] as const
                    )
                      .filter(([, v]) => Boolean(v))
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="grid gap-1 border-b border-line/60 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6"
                        >
                          <dt className="eyebrow pt-1">{k}</dt>
                          <dd className="leading-relaxed text-white/75">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </Reveal>
              )}

              <Reveal delay={0.1} className="mt-16">
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                  Key decisions
                </h2>
                <ol className="mt-8 border-t border-line/60">
                  {project.process?.map((step, i) => (
                    <li
                      key={i}
                      className="grid gap-3 border-b border-line/60 py-6 sm:grid-cols-[4rem_1fr]"
                    >
                      <span className="display text-2xl text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="leading-relaxed text-white/80">{step}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>

              {project.explored && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    What I explored
                  </h2>
                  <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                    {project.explored}
                  </p>
                </Reveal>
              )}

              <Reveal delay={0.1} className="mt-16">
                <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                  What changed
                </h2>
                <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                  {project.outcome}
                </p>
              </Reveal>

              {project.metrics?.length ? (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    {project.metrics.every((m) => m.kind === "scope")
                      ? "Product scope"
                      : "Outcomes & scope"}
                  </h2>
                  {project.tractionNote && (
                    <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-white/55">
                      {project.tractionNote}
                    </p>
                  )}
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                    {project.metrics.map((m) => (
                      <li
                        key={m.label}
                        className="rounded-sm border border-line/60 bg-white/[0.02] p-5"
                      >
                        <span
                          className={`text-[0.625rem] uppercase tracking-[0.16em] ${
                            m.kind === "impact"
                              ? "text-accent/90"
                              : "text-white/40"
                          }`}
                        >
                          {m.kind === "impact"
                            ? "Design impact"
                            : m.kind === "scope"
                              ? "Product scope"
                              : "Company-reported traction"}
                        </span>
                        <p className="display mt-3 text-[clamp(2rem,3.4vw,3rem)] leading-none text-white">
                          {m.value}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                          {m.label}
                        </p>
                        {m.note && (
                          <p className="mt-2 text-xs leading-relaxed text-white/45">
                            {m.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {project.evidence && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    Evidence
                  </h2>
                  <p className="mt-6 rounded-sm border border-line/60 bg-white/[0.025] p-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/80">
                    {project.evidence}
                  </p>
                </Reveal>
              )}

              {project.improveNext && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    What I would improve next
                  </h2>
                  <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
                    {project.improveNext}
                  </p>
                </Reveal>
              )}

              {project.improveWithTime && (
                <Reveal delay={0.1} className="mt-16">
                  <h2 className="display text-[clamp(2rem,3.5vw,3.4rem)]">
                    With more time
                  </h2>
                  <p className="mt-6 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-white/75">
                    {project.improveWithTime}
                  </p>
                </Reveal>
              )}
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
                      width={(sizes as Record<string, { w: number; h: number }>)[img.src]?.w}
                      height={(sizes as Record<string, { w: number; h: number }>)[img.src]?.h}
                      className="block h-auto w-full"
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
