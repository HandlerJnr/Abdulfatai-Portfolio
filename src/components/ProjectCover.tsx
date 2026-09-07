"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectArt } from "./ProjectArt";
import covers from "@/data/covers.json";

type Props = {
  project: Project;
  /** Larger padding + frame detail for hero placements. */
  size?: "card" | "hero";
  priority?: boolean;
};

/**
 * Art-directed cover. Real Behance imagery is presented inside a mockup shell
 * — browser chrome for web products, a device frame for mobile — sitting on a
 * tinted ground drawn from the project's own art direction. Projects without a
 * cover image fall back to the generated SVG composition.
 *
 * Images are loaded straight from Behance's CDN by the browser (no server-side
 * optimisation), so nothing breaks if that host rejects proxied requests.
 */
export function ProjectCover({ project, size = "card", priority }: Props) {
  // If the remote cover fails to load (host down, hotlink blocked, URL rotated),
  // fall back to the generated artwork rather than showing an empty frame.
  const [failed, setFailed] = useState(false);

  // A locally downloaded copy (via `npm run covers`) always wins over the
  // remote Behance URL.
  const src =
    (covers as Record<string, string>)[project.slug] ?? project.cover;

  if (!src || failed) {
    return <ProjectArt project={project} />;
  }

  const { hue, accent } = project.art;
  const isPhone = project.frame === "phone";
  const pad = size === "hero" ? "p-6 md:p-14" : "p-4 md:p-8";

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${pad}`}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 78% 12%, ${accent}22, transparent 62%), linear-gradient(140deg, ${hue}, #05050C 78%)`,
      }}
    >
      {/* faint grid, matching the generated artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {isPhone ? (
        <div className="relative h-full w-auto max-w-full">
          <div className="relative flex h-full items-center justify-center">
            <div className="relative h-full overflow-hidden rounded-[8%/4%] border border-white/15 bg-[#0b0b14] p-[0.8%] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${project.title} — ${project.category}`}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                onError={() => setFailed(true)}
                className="h-full w-auto rounded-[7%/3.4%] object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <figure className="relative w-full overflow-hidden rounded-md border border-white/15 bg-[#0b0b14] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
            </span>
            <span
              aria-hidden="true"
              className="ml-2 hidden h-3 flex-1 rounded-full bg-white/[0.07] sm:block"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${project.title} — ${project.category}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed(true)}
            className="block w-full object-cover"
            style={{ aspectRatio: size === "hero" ? "16 / 9" : "16 / 10" }}
          />
        </figure>
      )}

      <span className="display pointer-events-none absolute bottom-3 left-4 text-xs tracking-[0.22em] text-white/45 md:bottom-5 md:left-7 md:text-sm">
        {project.title.toUpperCase()} — {project.year}
      </span>
    </div>
  );
}
