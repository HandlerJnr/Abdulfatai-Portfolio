import Link from "next/link";
import { inProgressProjects } from "@/data/projects";
import { Reveal } from "./Reveal";

/**
 * One slot for work that is still being made. It sits after the featured
 * gallery so it never competes with finished, evidenced work, and it says
 * exactly which stage the project is at — a recruiter should be able to
 * come back in two weeks and see the marker move.
 */
const stages = [
  "Research",
  "Wireframes",
  "UI design",
  "Prototype",
  "Usability test",
] as const;

// Index into `stages`. Advance this as the project moves.
const currentStage = 0;
const started = "12 Sept 2026";

export function NowBuilding() {
  const project = inProgressProjects[0];
  if (!project) return null;

  return (
    <section
      id="now-building"
      aria-labelledby="now-building-heading"
      className="scroll-mt-16 border-t border-line/60 px-5 py-20 md:px-10 md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now building
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              id="now-building-heading"
              className="display mt-6 text-[clamp(2.6rem,5.5vw,5.5rem)] leading-none"
            >
              {project.title}
            </h2>
            <p className="mt-3 text-sm text-white/60">{project.category}</p>
          </Reveal>
          <Reveal delay={0.16} className="mt-8">
            <p className="max-w-[46ch] leading-relaxed text-white/70">
              {project.tagline}
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-white/50">
              A live project written up as it happens. Started {started}; the
              research runs alongside my own first month in Brighton.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8">
            <Link
              href={`/work/${project.slug}`}
              data-cursor="view"
              className="link-line eyebrow !text-white/80"
            >
              Follow the case study →
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.2}>
            <ol
              className="grid gap-0 border-t border-line/60"
              aria-label="Project progress"
            >
              {stages.map((s, i) => {
                const state =
                  i < currentStage
                    ? "done"
                    : i === currentStage
                      ? "current"
                      : "upcoming";
                return (
                  <li
                    key={s}
                    className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line/60 py-5"
                    aria-current={state === "current" ? "step" : undefined}
                  >
                    <span
                      className={`display text-lg tabular-nums ${
                        state === "upcoming" ? "text-white/30" : "text-white"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`display text-[clamp(1.2rem,2vw,1.6rem)] leading-none ${
                        state === "upcoming" ? "text-white/40" : "text-white"
                      }`}
                    >
                      {s}
                    </span>
                    <span
                      className={`text-[0.625rem] uppercase tracking-[0.16em] ${
                        state === "current"
                          ? "text-accent"
                          : state === "done"
                            ? "text-white/60"
                            : "text-white/30"
                      }`}
                    >
                      {state === "current"
                        ? "In progress"
                        : state === "done"
                          ? "Done"
                          : "Next"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
